function sameId(left, right) {
  return left != null && right != null && String(left) === String(right);
}

function isAdmin(user) {
  return user?.role === "admin";
}

function isAssignedWorker(user, issue) {
  return user?.role === "worker" && sameId(issue?.assignedTo, user.id);
}

function isReporter(user, issue) {
  return user?.role === "citizen" && sameId(issue?.reportedBy, user.id);
}

function canUpdateIssue(user, issue) {
  return isAdmin(user) || isAssignedWorker(user, issue);
}

function canResolveIssue(user, issue) {
  return canUpdateIssue(user, issue);
}

function canDeleteIssue(user, issue) {
  return isAdmin(user) || isReporter(user, issue);
}

function canSubmitFeedback(user, issue) {
  return isReporter(user, issue) && issue?.status === "Resolved";
}

module.exports = {
  sameId,
  isAssignedWorker,
  isReporter,
  canUpdateIssue,
  canResolveIssue,
  canDeleteIssue,
  canSubmitFeedback,
};
