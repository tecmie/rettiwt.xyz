-- CreateTable
CREATE TABLE "Sentiment" (
    "id" SERIAL NOT NULL,
    "author_id" TEXT NOT NULL,
    "tweet_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sentiment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sentiment" ADD CONSTRAINT "Sentiment_tweet_id_fkey" FOREIGN KEY ("tweet_id") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sentiment" ADD CONSTRAINT "Sentiment_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
