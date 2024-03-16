import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
            .map(obj => obj.tags)
            .flat()
            .slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
}

export const getAll = async (req, res) => {
    try {
        //const posts = await PostModel.find().populate('user').exec(); - если нужно передать всю инфу о user
        // PostModel.find() используется для поиска документов
        // в коллекции,
        // populate('user') заполняет ссылочное поле 'user' данными из другой коллекции,
        // exec() выполняет запрос к базе данных, возвращая объект запроса.
        const posts = await PostModel.find().populate('user', ['fullName', 'avatarUrl']).exec();//токо  fullName и avatarUrl
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;// id в запросе передаеься - app.get('/posts/:id' ...
        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: {viewsCount: 1},
            },
            {
                returnDocument: "after",
            }
        )
            .populate('user') // Добавляем populate для поля 'user'
            .then((doc) => {
                    if (!doc) {
                        return res.status(404).json({
                            message: "Статья не найдена",
                        });
                    }
                    res.json(doc);
                }
            )
            .catch((err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            message: "Не удалось вернуть статью",
                        });
                    }
                }
            );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndRemove({
                _id: postId,
            }
        ).then((doc) => {
                if (!doc) {
                    return res.status(404).json({
                        message: "Статья не найдена",
                    });
                }
                res.json({success: true,});
            }
        ).catch((err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Не удалось удалить статью",
                    });
                }
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить статью',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId, //записали после checkAuth.js
        });

        const post = await doc.save();

        res.json(post);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            },
        );
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};