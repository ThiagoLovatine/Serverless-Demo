const jobs = [
  { id: 1, name: "First job" },
  { id: 2, name: "Second job" },
  { id: 3, name: "Third job" },
  { id: 4, name: "Fourth job" },
];

module.exports.jobFindOne = async (evt, ctx) => {
  const jobId = evt.id;
  const jobQuery = jobs.filter((item) => parseInt(item.id) === parseInt(jobId));
  const jobFound = jobQuery.length > 0;
  const code = !jobFound ? 404 : 200;
  const message = !jobFound ? "Oops job not found" : "Job found!";
  const job = !jobFound ? {} : jobQuery[0];
  const body = JSON.stringify({ message, job });

  return {
    code,
    body,
  };
};
