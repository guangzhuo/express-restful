import mongoose, { ConnectOptions, Schema, Model } from 'mongoose'

export function connect(opts?: ConnectOptions) {
  const { DB_URL, DB_DATABASE } = process.env
  const mongodbUrl = `${DB_URL}/${DB_DATABASE}`

  const mongodbOptions: ConnectOptions = Object.assign(
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      server: {
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
      },
    },
    opts,
  )
  mongoose
    .connect(mongodbUrl, mongodbOptions)
    .then(() => console.log('mongodb ok'))
    .catch((e) => console.log(e))

  process.on('exit', (code) => {
    mongoose.connection.close()
    console.log(`About to exit with code: ${code}`)
  })

  process.on('SIGINT', () => {
    console.log('Caught interrupt signal')
    process.exit()
  })
}

export function createCollection<T extends mongoose.Document>(
  name: string,
  schema: Schema,
): Model<T> {
  return mongoose.model<T>(name, schema)
}

export const timestamps = { timestamps: { createdAt: 'created_at', updatedAt: 'update_at' } }
