import admin from "firebase-admin"
import sinon, { SinonStub } from "sinon"

// Require and initialize firebase-functions-test. Since we are not passing in any parameters, it will
// be initialized in an "offline mode", which means we have to stub out all the methods that interact
// with Firebase services.
const test = require("firebase-functions-test")()

describe("Cloud Functions", () => {
  let database
  let adminInitStub: SinonStub

  beforeEach(() => {
    // [START stubAdminInit]
    // If index.js calls admin.initializeApp at the top of the file,
    // we need to stub it out before requiring index.js. This is because the
    // functions will be executed as a part of the require process.
    // Here we stub admin.initializeApp to be a dummy function that doesn't do anything.
    adminInitStub = sinon.stub(admin, "initializeApp")
    // Now we can require index.js and save the exports inside a namespace called myFunctions.
    database = require("../database")
    // [END stubAdminInit]
  })

  afterEach(() => {
    // Restore admin.initializeApp() to its original method.
    adminInitStub.restore()
    // Do other cleanup tasks.
    test.cleanup()
  })

  describe("makeUpperCase", () => {
    // Test Case: setting messages/{pushId}/original to 'input' should cause 'INPUT' to be written to
    // messages/{pushId}/uppercase
    it("should upper case input and write it to /uppercase", () => {
      // [START assertOffline]
      const childParam = "uppercase"
      const setParam = "INPUT"
      // Stubs are objects that fake and/or record function calls.
      // These are excellent for verifying that functions have been called and to validate the
      // parameters passed to those functions.
      const childStub = sinon.stub()
      const setStub = sinon.stub()
      // [START fakeSnap]
      // The following lines creates a fake snapshot, 'snap', which returns 'input' when snap.val() is called,
      // and returns true when snap.ref.parent.child('uppercase').set('INPUT') is called.
      const snap = {
        val: () => "input",
        ref: {
          parent: {
            child: childStub,
          },
        },
      }
      childStub.withArgs(childParam).returns({ set: setStub })
      setStub.withArgs(setParam).returns(true)
      // [END fakeSnap]
      // Wrap the makeUppercase function.
      const wrapped = test.wrap(myFunctions.makeUppercase)
      // Since we've stubbed snap.ref.parent.child(childParam).set(setParam) to return true if it was
      // called with the parameters we expect, we assert that it indeed returned true.
      return assert.equal(wrapped(snap), true)
      // [END assertOffline]
    })
  })
})
