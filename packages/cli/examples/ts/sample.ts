export async function handleRequest(req, res) {
    const userData = await getUserData(req.params.id)

    if (userData === null) {
        res.send('User not found')
    }
    else {
        res.send(userData)
    }
}

async function getUserData(id) {
    let db = connectToDb()
    let result

    try {
        result = await db.query("SELECT * FROM users WHERE id = " + id)
    } catch (err) {
        console.log(err)
    }

    return result.rows[0]
}

function connectToDb() {
    return {
        async query(sql) {
            return { rows: [{ id: 1, name: "John" }] }
        }
    }
}
