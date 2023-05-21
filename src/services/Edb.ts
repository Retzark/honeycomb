import { CONFIG } from '@src/config';
import { Pool } from 'pg';

const Edb = () => {
  const pool = new Pool({
    connectionString: CONFIG.dbcs,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const insertStats = (stat: any) => {
    //is good
    let stats = {
      string: stat.string,
      int: stat.int,
    };

    return new Promise((r, e) => {
      pool.query(
        `INSERT INTO statssi(string,int)VALUES($1,$2)`,
        [stats.string, stats.int],
        (err, res) => {
          if (err) {
            console.log(`Error - Failed to insert data into statssi`);
            e(err);
          } else {
            r(res);
          }
        }
      );
    });
  };

  const getPost = (author: string, permlink: string) => {
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

  const updatePromote = (author: any, permlink: any, amt: any) => {
    return new Promise((r, e: any) => {
      getPost(post.author, post.permlink).then((post: any) => {
        let amount = post.promote + amt;
        pool.query(
          `UPDATE posts
                    SET promote = '${amount}'
                    WHERE author = '${author}' AND
                        permlink = '${permlink}';`,
          (err, res) => {
            if (err) {
              insertStats(stat)
                .then((ret: any) => {
                  r(ret);
                })
                .catch((err: any) => {
                  console.log(err, err);
                  e(err, err);
                });
            } else {
              r(res);
            }
          }
        );
      });
    });
  };

  return {
    updatePromote,
  };
};

export default Edb;
