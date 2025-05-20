// controllers/timePlan.controller.js
const db = require('../config/db');

const courseAbilityMap = {
  '359001': ['資料分析', '簡報技巧', '時間管理'],
  '360001': ['資料分析', '英文能力', '溝通能力'],
  '604021': ['英文能力', '溝通能力', '團隊合作'],
  '306088001': ['SQL 資料庫', 'Python 編程', '資料分析'],
  '306009001': ['溝通能力', '團隊合作', '創造力'],
  '306013001': ['演算法理解', 'Python 編程', '資料分析'],
  '306047001': ['時間管理', '簡報技巧', '團隊合作'],
  '306048001': ['創造力', '資料分析', '溝通能力'],
};

const getTimePlan = async (req, res) => {
  const studentId = req.params.id;

  try {
    // 取得平均成績
    const [[{ avg_score }]] = await db.promise().query(
      `SELECT AVG(course_score) AS avg_score FROM Performance WHERE student_id = ?`,
      [studentId]
    );

    if (!avg_score) {
      return res.status(400).json({ error: '學生尚無歷年成績，無法計算 Time Plan。' });
    }

    // 取得學生選課資料 + 課程學分數
    const [courses] = await db.promise().query(
      `SELECT sc.course_id, c.course_name, sc.expected_grade, sc.estimated_study_hours, c.credits
       FROM Student_Course_Selection sc
       JOIN Course c ON sc.course_id = c.course_id
       WHERE sc.student_id = ?`,
      [studentId]
    );

    if (courses.length === 0) {
      return res.status(400).json({ error: '尚未選課' });
    }

    // 取得學生能力與等級（JOIN Ability 表拿 ability_name）
    const [abilities] = await db.promise().query(
      `SELECT a.ability_name, sa.ability_level
       FROM Student_Ability sa
       JOIN Ability a ON sa.ability_id = a.ability_id
       WHERE sa.student_id = ?`,
      [studentId]
    );

    const abilityMap = {};
    abilities.forEach(a => {
      abilityMap[a.ability_name] = a.ability_level;
    });

    // 取得社團資料
    const [activities] = await db.promise().query(
      `SELECT activity_name, weekly_time_commitment FROM Extracurricular_Activity WHERE student_id = ?`,
      [studentId]
    );

    const courseReviewTimes = {};
    let totalReviewHours = 0;
    let totalClassHours = 0;

    courses.forEach(course => {
      const relatedAbilities = courseAbilityMap[course.course_id] || [];

      let weightSum = 0;
      relatedAbilities.forEach(ab => {
        if (abilityMap[ab]) {
          weightSum += 1 / abilityMap[ab];
        } else {
          weightSum += 1;
        }
      });

      const reviewTime = weightSum * (course.expected_grade / avg_score) * course.credits;
      courseReviewTimes[course.course_name] = Number(reviewTime.toFixed(2));
      totalReviewHours += reviewTime;
      totalClassHours += course.estimated_study_hours;
    });

    const totalClubHours = activities.reduce(
      (sum, act) => sum + act.weekly_time_commitment,
      0
    );

    // 平均分配到 Mon~Fri
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const weeklyPlan = {};
    const avgReviewPerDay = totalReviewHours / 5;
    const avgClassPerDay = totalClassHours / 5;
    const avgClubPerDay = totalClubHours / 5;

    days.forEach(day => {
      weeklyPlan[day] = {
        class_hours: Number(avgClassPerDay.toFixed(2)),
        review_hours: Number(avgReviewPerDay.toFixed(2)),
        club_hours: Number(avgClubPerDay.toFixed(2)),
      };
    });

    res.json({
      avg_score,
      courseReviewTimes,
      activities,
      weeklyPlan
    });
  } catch (err) {
    console.error('❌ Time plan 計算失敗:', err);
    res.status(500).json({ error: 'Time plan 計算失敗' });
  }
};

module.exports = { getTimePlan };
