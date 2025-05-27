const db = require("../config/db");

// 課程能力對應表（已補上 306008001）
const courseAbilityMap = {
  359001: ["資料分析", "簡報技巧", "時間管理"],
  360001: ["資料分析", "英文能力", "溝通能力"],
  604021: ["英文能力", "溝通能力", "團隊合作"],
  306088001: ["SQL 資料庫", "Python 編程", "資料分析"],
  306009001: ["溝通能力", "團隊合作", "創造力"],
  306013001: ["演算法理解", "Python 編程", "資料分析"],
  306047001: ["時間管理", "簡報技巧", "團隊合作"],
  306048001: ["創造力", "資料分析", "溝通能力"],
  306008001: ["SQL 資料庫", "資料分析", "邏輯思維"], // ✅ 補上資料庫管理課程
};

const getTimePlan = async (req, res) => {
  const studentId = req.params.id;

  try {
    console.log("🔍 Step 1: 接收到 studentId =", studentId);

    const [avgScoreRows] = await db
      .promise()
      .query(
        `SELECT AVG(course_score) AS avg_score FROM Performance WHERE student_id = ?`,
        [studentId]
      );

    const avg_score = avgScoreRows[0]?.avg_score;
    console.log("📊 Step 2: avg_score =", avg_score);

    if (!avg_score) {
      return res
        .status(400)
        .json({ error: "學生尚無歷年成績，無法計算 Time Plan。" });
    }

    const [courses] = await db.promise().query(
      `SELECT sc.course_id, c.course_name, sc.expected_grade, sc.estimated_study_hours, c.credits
       FROM Student_Course_Selection sc
       JOIN Course c ON sc.course_id = c.course_id
       WHERE sc.student_id = ?`,
      [studentId]
    );

    if (courses.length === 0) {
      return res.status(400).json({ error: "尚未選課" });
    }
    console.log("📚 Step 3: courses =", courses);

    const [abilities] = await db.promise().query(
      `SELECT a.ability_name, sa.ability_level
       FROM Student_Ability sa
       JOIN Ability a ON sa.ability_id = a.ability_id
       WHERE sa.student_id = ?`,
      [studentId]
    );

    const abilityMap = {};
    abilities.forEach((a) => {
      abilityMap[a.ability_name] = a.ability_level;
    });

    const [activities] = await db.promise().query(
      `SELECT ea.activity_name, ea.weekly_time_commitment
       FROM Participate p
       JOIN Extracurricular_Activity ea ON p.activity_id = ea.activity_id
       WHERE p.student_id = ?`,
      [studentId]
    );

    const courseReviewTimes = {};
    let totalReviewHours = 0;
    let totalClassHours = 0;

    courses.forEach((course) => {
      const relatedAbilities = courseAbilityMap[String(course.course_id)] || [];

      let weightSum = 0;
      relatedAbilities.forEach((ab) => {
        if (abilityMap[ab]) {
          weightSum += 1 / abilityMap[ab];
        } else {
          weightSum += 1;
        }
      });

      // fallback 防止 reviewTime 為 0
      const reviewTime =
        weightSum > 0
          ? weightSum * (course.expected_grade / avg_score) * course.credits
          : course.credits;

      courseReviewTimes[course.course_name] = Number(reviewTime.toFixed(2));
      totalReviewHours += reviewTime;
      totalClassHours += course.estimated_study_hours;
    });

    const totalClubHours = activities.reduce(
      (sum, act) => sum + act.weekly_time_commitment,
      0
    );

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const weeklyPlan = {};
    const avgReviewPerDay = totalReviewHours / 5;
    const avgClassPerDay = totalClassHours / 5;
    const avgClubPerDay = totalClubHours / 5;

    days.forEach((day) => {
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
      weeklyPlan,
    });
  } catch (err) {
    console.error("❌ Time plan 計算失敗:", err);
    res.status(500).json({ error: "Time plan 計算失敗" });
  }
};

module.exports = { getTimePlan };
