import uuid from 'uuid';
import * as dynamoDBLib from './libs/dynamodb-lib';
import {success, failure} from './libs/response-lib';


export async function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: "serverless-rekognition",
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'analyticId': a unique uuid
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      analyticId: uuid.v1(),
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };


  try {
    await dynamoDBLib.call("put",params);
    callback(null, success(params.Item));
  } catch (e) {
    callback(null, failure({status: false}));
  }
  //console.log(context);
}
