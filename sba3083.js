



let courseInfo = {
    id: 3040,
    name: "Introduction to JavaScript"
  };
  
  let assignmentInfo1 = {
    id: 1,
    name: "SBA",
    due_at: "2023-12-31T23:59:59",
    points_possible: 100
  };
  
  let assignmentInfo2 = {
    id: 2,
    name: "SBA2",
    due_at: "2023-12-31T23:59:59",
    points_possible: 200
  };
  
  let assignmentGroup = {
    id: 1,
    name: "SBA group",
    course_id: courseInfo.id,
    group_weight: 100,
    assignments: [assignmentInfo1, assignmentInfo2]
  };
  
  let learnerSubmission1 = {
    learner_id: 4242,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-12-30T12:35:00",
      score: 90
    }
  };
  
  let learnerSubmission2 = {
    learner_id: 4242,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-12-30T12:34:56",
      score: 180
    }
  };
  
  let learnerSubmissionsArray = [learnerSubmission1, learnerSubmission2];
  
  function validatePointsPossible(pointsPossible) {
    if (pointsPossible <= 0) {
      throw new Error("points_possible must be greater than 0.");
    }
  }
  
  function validateCourseAssignmentGroup(courseInfo, assignmentGroup) {
    if (assignmentGroup.course_id !== courseInfo.id) {
      throw new Error("AssignmentGroup does not belong to the course.");
    }
  }
  
  function calculateWeightedScore(score, pointsPossible, groupWeight, dueDate, submittedDate) {
    if (new Date(submittedDate) <= new Date(dueDate)) {
      return (score / pointsPossible) * groupWeight;
    }
    return (score / pointsPossible) * groupWeight * 0.9;
  }
  
  function calculateWeightedAverage(submissions, assignments) {
    let totalWeightedScore = 0;
    let totalWeight = 0;
  
    submissions.forEach(submission => {
      const assignment = assignments.find(a => a.id === submission.assignment_id);
  
      if (assignment && new Date(assignment.due_at) <= new Date() && new Date(submission.submission.submitted_at) <= new Date()) {
        validatePointsPossible(assignment.points_possible);
  
        const weightedScore = calculateWeightedScore(
          submission.submission.score,
          assignment.points_possible,
          assignment.group_weight,
          assignment.due_at,
          submission.submission.submitted_at
        );
  
        console.log(`Submission ${submission.assignment_id} - Weighted Score: ${weightedScore}`);
  
        totalWeightedScore += weightedScore;
        totalWeight += assignment.group_weight;
      }
    });
  
    console.log(`Total Weighted Score: ${totalWeightedScore}, Total Weight: ${totalWeight}`);
  
    if (totalWeight > 0) {
      return totalWeightedScore / totalWeight;
    }
  
    return 0;
  }
  
  function transformData(learnerSubmissions, assignments) {
    let result = {};
  
    learnerSubmissions.forEach(submission => {
      const learnerId = submission.learner_id;
      const assignmentId = submission.assignment_id;
  
      if (!result[learnerId]) {
        result[learnerId] = { id: learnerId, avg: 0 };
      }
  
      const assignment = assignments.find(a => a.id === assignmentId);
  
      if (assignment && new Date(assignment.due_at) <= new Date() && new Date(submission.submission.submitted_at) <= new Date()) {
        try {
          validatePointsPossible(assignment.points_possible);
          const scorePercentage = calculateWeightedScore(
            submission.submission.score,
            assignment.points_possible,
            assignment.group_weight,
            assignment.due_at,
            submission.submission.submitted_at
          );
  
          console.log(`Assignment ${assignment.id} - Score Percentage: ${scorePercentage}`);
  
          result[learnerId][assignmentId] = scorePercentage;
        } catch (error) {
          console.error(`Error from student submission ${learnerId}: ${error.message}`);
        }
      }
    });
  
    for (const learnerId in result) {
      try {
        const avg = calculateWeightedAverage(
          learnerSubmissions.filter(submission => submission.learner_id === parseInt(learnerId)),
          assignments
        );
        result[learnerId].avg = avg * 100;
      } catch (error) {
        console.error(`Error calculating average for learner ${learnerId}: ${error.message}`);
      }
    }
  
    return Object.values(result);
  }
  
  function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
    try {
      validateCourseAssignmentGroup(courseInfo, assignmentGroup);
      return transformData(learnerSubmissions, assignmentGroup.assignments);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      return [];
    }
  }
  
  const learnerData = getLearnerData(courseInfo, assignmentGroup, learnerSubmissionsArray);
  console.log(learnerData);