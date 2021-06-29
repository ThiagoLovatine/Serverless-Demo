const AWS = require("aws-sdk");

const options = process.env.IS_OFFLINE ? { region: "localhost", endpoint: "http://localhost:8000" } : {}
const DynamoDB = new AWS.DynamoDB.DocumentClient(options);

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
