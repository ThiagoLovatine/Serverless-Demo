module.exports.jobList = async (evt, ctx) => {
  return {
    code: 200,
    body: JSON.stringify(
      {
        message: "List of jobs!",
      },
      null, // replacer
      2 // space
    ),
  };
};
