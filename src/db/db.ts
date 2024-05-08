import { MongoClient } from "mongodb"

export type CounterType = {
    user: number,
    form: number,
}

const uri = "mongodb://127.0.0.1:27017"
// const uri = "mongodb+srv://plyuha2004:lqXIeqtSBJQjqJKN@cluster.0qbw0bk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster"

export const client = new MongoClient(uri)
export const db = client.db('forms')

type IdCounter = {
    form: number,
}

export async function getCount(collectionName: string) {
    const countersCollection = db.collection<IdCounter>('counters');
    let counters = await countersCollection.findOne()
    if (counters === null) {
        const co: CounterType = {
            form: 1,
            user: 1,
        }
        await countersCollection.insertOne(co)
        counters = await countersCollection.findOne()
    }
    if (collectionName in counters) {
        counters[collectionName] += 1
    } else {
        counters[collectionName] = 1
    }
    db.collection<IdCounter>('counters').updateOne(
        {},
        {
            
            "$set": counters
        }
    )
    return counters[collectionName]

}

