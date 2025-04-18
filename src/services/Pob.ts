import { Pool } from 'pg';
import { CONFIG } from '@src/config';
import { PathService } from '.';

const Pob = () => {
  const { getPathObj } = PathService();

  const pool = new Pool({
    connectionString: CONFIG.dbcs,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const findBlog = async (un: string) => {};

  const findAuthorPosts = async (
    author: string,
    amount: number,
    offSet: number
  ) => {
    let off = offSet;
    let amt = amount;

    if (!amount) amt = 50;
    if (!off) off = 0;

    return new Promise((r, e) => {
      pool.query(
        `SELECT 
                      author, 
                      permlink, 
                      block, 
                      votes, 
                      voteweight, 
                      promote, 
                      paid 
                  FROM 
                      posts
                  WHERE
                      author = '${author}' 
                  ORDER BY 
                      block DESC 
                  OFFSET ${off} ROWS FETCH FIRST ${amt} ROWS ONLY;`,
        (err: any, res: any) => {
          if (err) {
            console.log(`Error - Failed to select some new from Posts`);
            e(err);
          } else {
            r(res.rows);
          }
        }
      );
    });
  };

  const findPost = async (author: string, permlink: string) => {
    return new Promise((r, e) => {
      pool.query(
        `SELECT * FROM posts WHERE author = '${author}' AND permlink = '${permlink}';`,
        (err, res) => {
          if (err) {
            console.log(`Error - Failed to get a post from posts`);
            e(err);
          } else {
            r(res.rows[0]);
          }
        }
      );
    });
  };

  const findNewPosts = async (amount: number, offset: number) => {
    let off = offset;
    let amt = amount;

    if (!amount) amt = 50;
    if (!off) off = 0;

    return new Promise((r, e) => {
      pool.query(
        `SELECT author, permlink, block, votes, voteweight, promote, paid FROM posts ORDER BY block DESC OFFSET ${off} ROWS FETCH FIRST ${amt} ROWS ONLY;`,
        (err, res) => {
          if (err) {
            console.log(`Error - Failed to select some new from posts`);
            e(err);
          } else {
            r(res.rows);
          }
        }
      );
    });
  };

  const findTrendingPosts = async (amount: number, offset: number) => {
    let off = offset;
    let amt = amount;

    if (!amount) amt = 50;
    if (!off) off = 0;

    return new Promise((r, e) => {
      pool.query(
        `SELECT 
                        author, 
                        permlink, 
                        block, 
                        votes, 
                        voteweight, 
                        promote, 
                        paid 
                    FROM 
                        posts 
                    WHERE 
                        paid = false
                    ORDER BY 
                        voteweight DESC
                    OFFSET ${off} ROWS FETCH FIRST ${amt} ROWS ONLY;`,
        (err, res) => {
          if (err) {
            console.log(`Error - Failed to select some new from posts`);
            e(err);
          } else {
            r(res.rows);
          }
        }
      );
    });
  };

  const findPromotedPosts = async (amount: number, offset: number) => {
    let off = offset;
    let amt = amount;

    if (!amount) amt = 50;
    if (!off) off = 0;

    return new Promise((r, e) => {
      pool.query(
        `SELECT 
                        author, 
                        permlink, 
                        block, 
                        votes, 
                        voteweight, 
                        promote, 
                        paid 
                    FROM 
                        posts 
                    WHERE 
                        promote > 0
                    ORDER BY 
                        promote DESC
                    OFFSET ${off} ROWS FETCH FIRST ${amt} ROWS ONLY;`,
        (err, res) => {
          if (err) {
            console.log(`Error - Failed to select some new from posts`);
            e(err);
          } else {
            r(res.rows);
          }
        }
      );
    });
  };

  const findPostAuthorPermlink = async (author: string, permlink: string) => {
    const nowp = getPathObj(['posts', `${author}/${permlink}`]);

    return Promise.all([nowp])
      .then((a: any) => {
        return {
          now: a[0],
          arch: a[1],
        };
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return {
    findBlog,
    findAuthorPosts,
    findPost,
    findNewPosts,
    findTrendingPosts,
    findPromotedPosts,
    findPostAuthorPermlink,
  };
};

export default Pob;
