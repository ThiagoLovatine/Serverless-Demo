const AWS = require("aws-sdk");

const DynamoDB = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
});

module.exports.jobDelete = async (evt, ctx) => {
  const id = String(evt.pathParameters.id);

  try {
    const params = {
      TableName: process.env.TABLE_JOBS,
      Key: {
        id,
      },
    };

    await DynamoDB.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({message: 'Job deleted!'}),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({message: 'Error deleting job'}),
    };
  }
};
