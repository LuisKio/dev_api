/* eslint-disable quotes */

const { describe, expect, test, it, beforeAll, mock, afterAll } = require("@jest/globals");
const request = require("supertest");
/**
 * Remember, app is our aplication with endpoints (routes), controllers, services...
 * So, use the envs vars
 *  DATABASE_URI_TEST = postgres://DB_USER:DB_PASSWORD@ localost:DB_PORT/DB_NAME
 *  NODE_ENV = test
 */
const { app } = require("../index");


afterAll(() => {
  console.info("El entorno está en: " + process.env.NODE_ENV);

  console.info("Recuerda que debes:");
  console.info("1) Usar una DB para test");
  console.info("2) Configurarla de manera correcta en el .env");
});

let user1token, user2Token, user3Token;

/****** Auth Login *****/

test("Login Credentials", async () => {
  /* User 1 Admin */
  const userAdminCredentials = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email: "user1@academlo.com",
      password: "passworduser1",
    });
  expect(userAdminCredentials.status).toBe(200);
  expect(userAdminCredentials.body.token).toBeTruthy();
  user1token = userAdminCredentials.body.token;

  /* User 2 Public */
  const user2Credentials = await request(app).post("/api/v1/auth/login").send({
    email: "user2@academlo.com",
    password: "passworduser2",
  });
  expect(user2Credentials.status).toBe(200);
  expect(user2Credentials.body.token).toBeTruthy();
  user2Token = user2Credentials.body.token;

  /* User 3 Public */
  const user3Credentials = await request(app).post("/api/v1/auth/login").send({
    email: "user3@academlo.com",
    password: "passworduser3",
  });
  expect(user3Credentials.status).toBe(200);
  expect(user3Credentials.body.token).toBeTruthy();
  user3Token = user3Credentials.body.token;

  /* Returns Error 401 - Wrong Credentials*/
  const wrongPassword = await request(app).post("/api/v1/auth/login").send({
    email: "user3@academlo.com",
    password: "password",
  });
  expect(wrongPassword.status).toBe(401);

  /* Returns Error 404 - Not Found User */
  const wrongUser = await request(app).post("/api/v1/auth/login").send({
    email: "notexist@academlo.com",
    password: "password",
  });
  expect(wrongUser.status).toBe(404);
});

test("User me works", async () => {
  const user1me = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${user1token}`);

  expect(user1me.status).toBe(200);
  expect(user1me.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        email: expect.any(String),
      }
    )
  );

});

/***** Applications ******/

test("Get Application must be protected", async () => {
  const application = await request(app).get("/api/v1/applications/application");
  expect(application.status).toBe(401);
});

test("Create Application must be protected", async () => {
  const application = await request(app).post("/api/v1/applications/");
  expect(application.status).toBe(401);
});

test("Update Application must be protected", async () => {
  const application = await request(app).put("/api/v1/applications/application");
  expect(application.status).toBe(401);
});


test("If not exist Application, return correct status - User 2", async () => {
  const applicationUser2 = await request(app)
    .get("/api/v1/applications/application")
    .set("Authorization", `Bearer ${user2Token}`);

  expect(applicationUser2.status).toBe(404);
});


test("Get Application as Same User", async () => {

  const user1me = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${user1token}`);

  expect(user1me.status).toBe(200);
  expect(user1me.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        email: expect.any(String),
      }
    )
  );


  const applicationUser1 = await request(app)
    .get("/api/v1/applications/application")
    .set("Authorization", `Bearer ${user1token}`);

  expect(applicationUser1.status).toBe(200);
  expect(applicationUser1.body?.results?.user_id).toBe(user1me.body.results.id)
  expect(applicationUser1.body?.results?.legal_first_names).toBe('Alejandro')
  expect(applicationUser1.body?.results?.legal_last_names).toBe('Magno')
  expect(applicationUser1.body?.results?.nationality).toBe('Macedonia')
  expect(applicationUser1.body?.results?.email).toBe('egipto@academlo.com')
  expect(applicationUser1.body?.results?.phone).toBe('019209309')
  expect(applicationUser1.body?.results?.date_of_birth).toBe('2020-12-30T00:00:00.000Z')
  expect(applicationUser1.body?.results?.gender).toBe('Masculino')
  expect(applicationUser1.body?.results?.passport_number).toBe('567890ASK987')
  expect(applicationUser1.body?.results?.passport_expiration_date).toBe('2023-01-30T00:00:00.000Z')
  expect(applicationUser1.body?.results?.residence).toBe('Malibu')
  expect(applicationUser1.body?.results?.residence_address).toBe('AV Always Live #007')
  expect(applicationUser1.body?.results?.job).toBe('Commander')
  expect(applicationUser1.body?.results?.comments).toBe('Egiptian Investigator')
  expect(applicationUser1.body?.results?.status).toBe('draft')
  expect(typeof applicationUser1.body?.results?.created_at).toBe("string")
  expect(typeof applicationUser1.body?.results?.updated_at).toBe("string")
});


test("Create Application as Same User", async () => {

  const user2me = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${user2Token}`);

  expect(user2me.status).toBe(200);
  expect(user2me.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        email: expect.any(String),
      }
    )
  );

  const user3me = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${user3Token}`);

  expect(user3me.status).toBe(200);
  expect(user3me.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        email: expect.any(String),
      }
    )
  );


  const applicationNotFoundUser2 = await request(app)
    .get("/api/v1/applications/application")
    .set("Authorization", `Bearer ${user2Token}`);

  expect(applicationNotFoundUser2.status).toBe(404);


  const applicationCreateUser2 = await request(app)
    .post("/api/v1/applications/")
    .set("Authorization", `Bearer ${user2Token}`)
    .send({
      user_id: user3me.body.results.id,
      legal_first_names: 'Alejandra',
      legal_last_names: 'Magna',
      nationality: 'Grecia',
      email: 'greek@academlo.com',
      phone: '123456789',
      date_of_birth: '2020-10-01T00:00:00.000Z',
      gender: 'Femenino',
      passport_number: 'ASDFG568K095',
      passport_expiration_date: '2023-10-01T00:00:00.000Z',
      residence: 'Florida',
      residence_address: 'AV Always Live #009',
      job: 'Queen',
      comments: 'Fictional Character'
    });

  expect(applicationCreateUser2.status).toBe(201);



  const applicationUser3 = await request(app)
    .get("/api/v1/applications/application")
    .set("Authorization", `Bearer ${user3Token}`);

  expect(applicationUser3.status).toBe(404);




  const applicationUser2 = await request(app)
    .get("/api/v1/applications/application")
    .set("Authorization", `Bearer ${user2Token}`);

  expect(applicationUser2.status).toBe(200);

  expect(applicationUser2.body?.results?.user_id).toBe(user2me.body.results.id)
  expect(applicationUser2.body?.results?.legal_first_names).toBe('Alejandra')
  expect(applicationUser2.body?.results?.legal_last_names).toBe('Magna')
  expect(applicationUser2.body?.results?.nationality).toBe('Grecia')
  expect(applicationUser2.body?.results?.email).toBe('greek@academlo.com')
  expect(applicationUser2.body?.results?.phone).toBe('123456789')
  expect(applicationUser2.body?.results?.date_of_birth).toBe('2020-10-01T00:00:00.000Z')
  expect(applicationUser2.body?.results?.gender).toBe('Femenino')
  expect(applicationUser2.body?.results?.passport_number).toBe('ASDFG568K095')
  expect(applicationUser2.body?.results?.passport_expiration_date).toBe('2023-10-01T00:00:00.000Z')
  expect(applicationUser2.body?.results?.residence).toBe('Florida')
  expect(applicationUser2.body?.results?.residence_address).toBe('AV Always Live #009')
  expect(applicationUser2.body?.results?.job).toBe('Queen')
  expect(applicationUser2.body?.results?.comments).toBe('Fictional Character')
  expect(applicationUser2.body?.results?.status).toBe('draft')
  expect(typeof applicationUser2.body?.results?.created_at).toBe("string")
  expect(typeof applicationUser2.body?.results?.updated_at).toBe("string")
});


test("Dont allow more than One Application", async () => {
  const applicationCreateUser1 = await request(app)
    .post("/api/v1/applications/")
    .set("Authorization", `Bearer ${user1token}`)
    .send({
      legal_first_names: "Alejandra",
      legal_last_names: "Magna",
      nationality: "Grecia",
      email: "greek@academlo.com",
      phone: "123456789",
      date_of_birth: "2020-10-01T00:00:00.000Z",
      gender: "Femenino",
      passport_number: "ASDFG568K095",
      passport_expiration_date: "2023-10-01T00:00:00.000Z",
      residence: "Florida",
      residence_address: "AV Always Live #009",
      job: "Queen",
      comments: "Fictional Character",
    });

  expect(applicationCreateUser1.status).toBe(409);
  expect(applicationCreateUser1.body.message).toContain("llave duplicada viola restricción de unicidad «applications_pkey»")
});

test("Update Application Dont Update USER ID", async () => {

  const user3me = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${user3Token}`);

  expect(user3me.status).toBe(200);
  expect(user3me.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        email: expect.any(String),
      }
    )
  );

  const user1me = await request(app)
    .get("/api/v1/auth/me")
    .set("Authorization", `Bearer ${user1token}`);

  expect(user1me.status).toBe(200);
  expect(user1me.body.results).toEqual(
    expect.objectContaining(
      {
        id: expect.any(String),
        email: expect.any(String),
      }
    )
  );


  const applicationUpdateUser1 = await request(app)
    .put("/api/v1/applications/application")
    .set("Authorization", `Bearer ${user1token}`)
    .send({
      user_id: user3me.body.results.id,
    });

  expect(applicationUpdateUser1.status).toBe(200);

  const applicationUser1 = await request(app)
    .get("/api/v1/applications/application")
    .set("Authorization", `Bearer ${user1token}`);

  expect(applicationUser1.status).toBe(200);

  expect(applicationUser1.body?.results?.user_id).toBe(user1me.body.results.id)
});


test("Update Application Status Field only receive 2 values - draft,confirmed", async () => {

  const applicationUpdateUser1 = await request(app)
    .put("/api/v1/applications/application")
    .set("Authorization", `Bearer ${user1token}`)
    .send({
      status: "myownstatus",
    });

  expect(applicationUpdateUser1.status).toBe(409);

  const applicationUser1 = await request(app)
    .get("/api/v1/applications/application")
    .set("Authorization", `Bearer ${user1token}`);

  expect(applicationUser1.status).toBe(200);
  expect(applicationUser1.body?.results?.status).toBe('draft')
});

test("Cannot Update Application if status is confirmed", async () => {

  const applicationUpdateUser1 = await request(app)
    .put("/api/v1/applications/application")
    .set("Authorization", `Bearer ${user1token}`)
    .send({
      status: "confirmed",
    });
  expect(applicationUpdateUser1.status).toBe(200);

  const applicationUser1 = await request(app)
    .get("/api/v1/applications/application")
    .set("Authorization", `Bearer ${user1token}`);

  expect(applicationUser1.status).toBe(200);
  expect(applicationUser1.body?.results?.status).toBe('confirmed')


  const applicationCanotUpdateUser1 = await request(app)
    .put("/api/v1/applications/application")
    .set("Authorization", `Bearer ${user1token}`)
    .send({
      status: "draft",
    });

  expect(applicationCanotUpdateUser1.status).toBe(403);
});