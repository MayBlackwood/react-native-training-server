SELECT f.addressee_id, u.* FROM user_friends
  JOIN users u ON u.id = f.addressee_id
 WHERE f.requestee_id = [];