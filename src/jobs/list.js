const AWS = require("aws-sdk");

const options = process.env.IS_OFFLINE
  ? { region: "localhost", endpoint: "http://localhost:8000" }
  : {};
const DynamoDB = new AWS.DynamoDB.DocumentClient(options);

module.exports.jobList = async (evt, ctx) => {
  params = {
    TableName: process.env.TABLE_JOBS,
    Limit: 10,
  };

  try {
    const newJobResponse = await DynamoDB.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(newJobResponse),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({message: 'Error fetching jobs'}),
    };
  }
};
