module.exports.jobCreate = async (evt, ctx) => {
  return {
    code: 200,
    body: JSON.stringify(
      {
        message: "Job created!",
      },
      null, // replacer
      2 // space
    ),
  };
};
