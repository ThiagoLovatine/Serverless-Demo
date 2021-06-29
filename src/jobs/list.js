const AWS = require("aws-sdk");

const DynamoDB = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
});


module.exports.jobList = async (evt, ctx) => {
  params = {
    TableName: process.env.TABLE_JOBS,
    Limit: 10
  }
  const newJobResponse = await DynamoDB.scan(params).promise();

  return {
    code: 200,
    body: JSON.stringify(newJobResponse),
  };
};
