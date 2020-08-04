CREATE TABLE user_friends (
  requester_id bigint NOT NULL,
  addressee_id bigint NOT NULL,
  created_date_time timestamp with time zone DEFAULT now() NOT NULL,
  accepted_date_time timestamp with time zone DEFAULT NULL,
  accepted BOOLEAN DEFAULT false NOT NULL,
  CONSTRAINT user_friends_pk PRIMARY KEY (requester_id, addressee_id),
  CONSTRAINT friendship_to_requester_fk FOREIGN KEY (requester_id) REFERENCES users (id),
  CONSTRAINT friendship_to_addressee_fk FOREIGN KEY (addressee_id) REFERENCES users (id)
);

INSERT INTO user_friends (
  requester_id, 
  addressee_id, 
  created_date_time,
  accepted_date_time,
  accepted
) VALUES
(77, 119, NULL, now(), false),
(77, 121, now(), now(), true),
(123, 121, now(), now(), true),
(123, 77, NULL, now(), false);