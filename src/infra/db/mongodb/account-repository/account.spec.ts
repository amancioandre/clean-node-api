import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'
import { Collection } from 'mongodb'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    const sut = new AccountMongoRepository()

    return sut
  }

  test('Should return an account on add success.', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.email).toBe('valid_email@mail.com')
    expect(account.password).toBe('hashed_password')
  })

  test('Should return an account on load by email success.', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
    const account = await sut.loadByEmail('valid_email@mail.com')

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.email).toBe('valid_email@mail.com')
    expect(account.password).toBe('hashed_password')
  })

  test('Should return null on load by email fails.', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('valid_email@mail.com')

    expect(account).toBeFalsy()
  })

  test('Should update the account accessToken on updateAccessToken success.', async () => {
    const sut = makeSut()
    const res = await accountCollection.insertOne({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
    expect(res.ops[0].accessToken).toBeFalsy()

    await sut.updateAccessToken(res.ops[0]._id, 'any_token')
    const account = await accountCollection.findOne({ _id: res.ops[0]._id })

    expect(account).toBeTruthy()
    expect(account.accessToken).toBe('any_token')
  })
})
