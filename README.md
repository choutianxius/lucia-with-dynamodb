# Examples Using DynamoDB with [Lucia Auth](https://github.com/lucia-auth/lucia)

From v4, [Lucia Auth] has transformed from a library into a learning source on implementing auth with JavaScript([link](https://github.com/lucia-auth/lucia/discussions/1707)). As a response, this repository will no longer provide a database adapter for DynamoDB, but be used to showcase example apps which I've built to learn auth with Lucia.

> [!NOTE]
> DynamoDB may not seem an obvious solution for auth-related persistence. I came into this route only because in one project my DB infra was restricted to DynamoDB because of billing issues.

## DynamoDB Table Schema

Since we need to query a user by user ID, query all sessions by user ID, and query a session by session ID, a GSI is required. The following table schema is used for all applications in this repository:

| *(Item Type)* | PK             | SK                   | GSIPK                | GSISK                | ExpiresAt (*TTL*) |
| ------------- | -------------- | -------------------- | -------------------- | -------------------- | ----------------- |
| *User*        | USER#[User ID] | USER#[User ID]       | *(Not used)*         | *(Not used)*         | *(Not specified)* |
| *Session*     | USER#[User ID] | SESSION#[Session ID] | SESSION#[Session ID] | SESSION#[Session ID] | [Unix Epoch Time] |

> [!NOTE]
> DynamoDB grants the flexibility to incorporate additional fields with the table schema above.

Here is an example of creating such a table with [`@aws-sdk/client-dynamodb`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/):

```typescript
const client = new DynamoDBClient({});

await client
  .send(new CreateTableCommand({
    TableName: tableName,
    AttributeDefinitions: [
      { AttributeName: "PK", AttributeType: "S" },
      { AttributeName: "SK", AttributeType: "S" },
      { AttributeName: "GSIPK", AttributeType: "S" },
      { AttributeName: "GSISK", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "PK", KeyType: "HASH" }, // primary key
      { AttributeName: "SK", KeyType: "RANGE" }, // sort key
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "GSI",
        Projection: { ProjectionType: "ALL" },
        KeySchema: [
          { AttributeName: "GSIPK", KeyType: "HASH" }, // GSI primary key
          { AttributeName: "GSISK", KeyType: "RANGE" }, // GSI sort key
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  }));

// enable TTL
await client
  .send(new UpdateTimeToLiveCommand({
    TableName: tableName,
    TimeToLiveSpecification: {
      Enabled: true,
      AttributeName: "ExpiresAt",
    },
  }));
```

