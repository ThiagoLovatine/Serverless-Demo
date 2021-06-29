const AWS = require("aws-sdk");

const DynamoDB = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
});

module.exports.jobFindOne = async (evt, ctx) => {
  const id = String(evt.pathParameters.id);

  try {
    const params = {
      TableName: process.env.TABLE_JOBS,
      Key: {
        id,
      },
    };

    const job = await DynamoDB.get(params).promise();
    const jobFound = job.Item;
    const body = jobFound ? job : { message: "Job Not Found" };
    const statusCode = jobFound ? 200 : 404;

    return {
      statusCode,
      body: JSON.stringify(body),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
