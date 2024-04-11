export const createConference = async (req, res) => {
  const { content } = req.body;

  const authorId = req.user.userId;

  if (!content) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  try {
    const conference = await prisma.conference.create({
      data: {
        content,
        authorId,
      },
    });

    res.json(conference);
  } catch (error) {
    console.error('Error in createConference:', error);

    res.status(500).json({ error: 'There was an error creating the conference' });
  }
};

export const getAllConferences = async (req, res) => {
  const userId = req.user.userId;

  try {
    const conferences = await prisma.conference.findMany({
      include: {
        likes: true,
        author: true,
        comments: true,
      },
      orderBy: {
        createdAt: 'desc', // 'desc' означает сортировку по убыванию, т.е. новые посты будут первыми
      },
    });

    const conferencesWithLikeInfo = conferences.map((conference) => ({
      ...conference,
      likedByUser: conference.likes.some((like) => like.userId === userId),
    }));

    res.json(conferencesWithLikeInfo);
  } catch (err) {
    res.status(500).json({ error: 'Произошла ошибка при получении постов' });
  }
};

export const getConferenceById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const conference = await prisma.conference.findUnique({
      where: { id },
      include: {
        comments: {
          include: {
            user: true,
          },
        },
        likes: true,
        author: true,
      }, // Include related conferences
    });

    if (!conference) {
      return res.status(404).json({ error: 'Пост не найден' });
    }

    const conferenceWithLikeInfo = {
      ...conference,
      likedByUser: conference.likes.some((like) => like.userId === userId),
    };

    res.json(conferenceWithLikeInfo);
  } catch (error) {
    res.status(500).json({ error: 'Произошла ошибка при получении поста' });
  }
};

export const deleteConference = async (req, res) => {
  const { id } = req.params;

  // Проверка, что пользователь удаляет свой пост
  const conference = await prisma.conference.findUnique({ where: { id } });

  if (!conference) {
    return res.status(404).json({ error: 'Пост не найден' });
  }

  if (conference.authorId !== req.user.userId) {
    return res.status(403).json({ error: 'Нет доступа' });
  }

  try {
    const transaction = await prisma.$transaction([
      prisma.comment.deleteMany({ where: { conferenceId: id } }),
      prisma.like.deleteMany({ where: { conferenceId: id } }),
      prisma.conference.delete({ where: { id } }),
    ]);

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Что-то пошло не так' });
  }
};
