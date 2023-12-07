
const courseInfo = {
  "id": 42,
  "name": "Javascript",
};

let assignmentGroup = {
  "id": courseInfo.id,
  "name": courseInfo.name,
  "course_id": 42,
  "group_weight": 'foo',
  "assignments": [
    {
      "id": 1,
      "name": 'sba1',
      "due_at": 2024,
      "points_possible": 100,
      "assignment_weight": 1
    },
    {
      "id": 2,
      "name": 'sba2',
      "due_at": 2024,
      "points_possible": 200,
      "assignment_weight": 2
    }
  ],
};

const learnerSubmissions = [
  {
    "learner_id": 77,
    "assignment_id": 1,
    "submission": {
      "submitted_at": 2025,
      "score": 89
    }
  },
  {
    "learner_id": 77,
    "assignment_id": 2,
    "submission": {
      "submitted_at": 2023,
      "score": 175
    }
  }
];

// Add a boolean variable
const isValidationEnabled = true;

// Functions...

function calculateLearnerScores(learnerSubmissions) {
  const learnerScores = {};

  for (const submission of learnerSubmissions) {
    const { learner_id, assignment_id, submission: { score } } = submission;

    if (!learnerScores[learner_id]) {
      learnerScores[learner_id] = {};
    }
    learnerScores[learner_id][assignment_id] = score;

    console.log(`Learner ${learner_id}, Assignment ${assignment_id}, Score ${score}`);
    console.log("Intermediate learnerScores:", learnerScores);
  }

  return learnerScores;
}

const learnerScores = calculateLearnerScores(learnerSubmissions);
console.log("Final learnerScores:", learnerScores);

function calculateTotalWeightedAverage(learnerScores, assignmentGroup) {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const learner_id in learnerScores) {
    if (learnerScores.hasOwnProperty(learner_id)) {
      const learnerScore = learnerScores[learner_id];

      for (const assignment of assignmentGroup.assignments) {
        const assignment_id = assignment.id;
        const assignmentScore = learnerScore[assignment_id];

        if (assignmentScore !== undefined) {
          // Ensure assignment_weight is a valid number
          const assignmentWeight = isNaN(assignment.assignment_weight) ? 1 : parseFloat(assignment.assignment_weight);

          totalWeightedScore += (assignmentScore / 100) * assignmentWeight;
          totalWeight += assignmentWeight;
        }
      }
    }
  }

  // Nan and infinity problems
  const totalWeightedAverage = (totalWeight !== 0 && !isNaN(totalWeightedScore) && isFinite(totalWeightedScore))
    ? (totalWeightedScore / totalWeight) * 100
    : 0;

  return totalWeightedAverage;
}

const totalWeightedAverage = calculateTotalWeightedAverage(learnerScores, assignmentGroup);
console.log("Total Weighted Average:", totalWeightedAverage);

function validateAssignmentGroup(assignmentGroup, courseInfo, isValidationEnabled) {
  try {
    if (isValidationEnabled) {
      if (assignmentGroup.course_id !== courseInfo.id) {
        throw new Error("Invalid input: AssignmentGroup does not belong to its course.");
      }

      for (const assignment of assignmentGroup.assignments) {
        // Err for points
        if (assignment.points_possible === 0) {
          throw new Error(`Invalid input: Assignment ${assignment.id} has points_possible set to 0.`);
        }

        if (isNaN(assignment.assignment_weight) || typeof assignment.assignment_weight !== 'number') {
          throw new Error(`Invalid input: Assignment ${assignment.id} has an invalid assignment_weight.`);
        }
      }
    }

    return true;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

try {
  validateAssignmentGroup(assignmentGroup, courseInfo, isValidationEnabled);
  console.log("AssignmentGroup is valid.");
} catch (error) {
  console.error("Validation failed:", error.message);
}

function processAssignments(assignmentGroup, learnerSubmissions) {
  const processedAssignments = [];

  for (const assignment of assignmentGroup.assignments) {
    // Skip processing if points_possible is 0
    if (assignment.points_possible === 0) {
      continue;
    }

    const submission = learnerSubmissions.find(sub => sub.assignment_id === assignment.id);

    if (submission) {
      if (new Date(submission.submitted_at) <= new Date(assignment.due_at)) {
        const isLate = new Date(submission.submitted_at) > new Date(assignment.due_at);
        const latePenalty = isLate ? 0.9 : 1;
        const adjustedScore = submission.score * latePenalty;

        processedAssignments.push({
          assignment_id: assignment.id,
          adjustedScore: adjustedScore,
          points_possible: assignment.points_possible,
        });
      }
    }
  }

  return processedAssignments;
}

const processedAssignments = processAssignments(assignmentGroup, learnerSubmissions);
console.log("Processed Assignments:", processedAssignments);