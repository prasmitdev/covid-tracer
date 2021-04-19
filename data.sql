Drop database if exists `data`;
create database `data`;
use `data`;

create table `users` (
`user_id` tinyint(4) not null auto_increment,
`group_id` tinyint(4) not null,
`first_name` varchar(50) not null,
`last_name` varchar(50) not null,
`age` int(10) not null,
`email` varchar(50) not null,
`phone` varchar(50) not null,
`state` char(2) not null,
`password` varchar(50) not null,
primary key (`user_id`,`group_id`),
key (`group_id`), 
key info (`email`, `phone`)
) engine=innodb
auto_increment=9
default charset=utf8
default collate=utf8_unicode_ci;
insert into `users` values (1, 1, 'tim', 'bo', 20, 'tim@gmail.com', '7133999201', 'TX','*****');
insert into `users` values (2, 2, 'fran', 'cis', 27, 'fcis@gmail.com', '9793789201', 'TX','*****');
insert into `users` values (3, 1, 'jim', 'bo', 24, 'jim@gmail.com', '9713294309', 'TX','*****');
insert into `users` values (4, 2, 'ag', 'e', 26, 'aggie@gmail.com', '2103955261', 'TX','*****');
insert into `users` values (5, 1, 'james', 'harden', 24, 'harden@gmail.com', '8123478044', 'TX','*****');
insert into `users` values (6, 2, 'al', 'tuve', 22, 'al27@gmail.com', '9792110490', 'TX','*****');
insert into `users` values (7, 2, 'mi', 'ke', 23, 'mike@gmail.com', '2104307789', 'TX','*****');
insert into `users` values (8, 1, 'h', 'awk', 23, 'hawk@gmail.com', '7905506413', 'TX','*****');
insert into `users` values (9, 1, 'jen', 'ifer', 21, 'jen@gmail.com', '8328844406', 'TX','*****');
insert into `users` values (10, 1, 'stay', 'si', 20, 'stacy@gmail.com', '2815906789', 'TX','*****');

create table `groups`(
`group_id` tinyint(4) not null,
`user_id` tinyint(4) not null,
`group_name` varchar(50) not null, 
primary key (`group_id`,`user_id`),
key (`user_id`)
)engine=innodb
default charset=utf8
default collate=utf8_unicode_ci;
insert into `groups` values(1,1,'church');
insert into `groups` values(2,2,'work');
insert into `groups` values(1,3,'church');
insert into `groups` values(2,4,'church');
insert into `groups` values(1,5,'church');
insert into `groups` values(2,6,'work');
insert into `groups` values(2,7,'work');
insert into `groups` values(1,8,'church');
insert into `groups` values(1,9,'church');
insert into `groups` values(1,10,'church');

create table `positive_test`(
`positive` enum('yes','no'),
`user_id` tinyint(4),
primary key response (`positive`,`user_id`)
)engine=innodb
default charset=utf8
default collate=utf8_unicode_ci;
insert into `positive_test` values('no',1);
insert into `positive_test` values('no',2);
insert into `positive_test` values('no',3);
insert into `positive_test` values('yes',4);
insert into `positive_test` values('no',5);
insert into `positive_test` values('no',6);
insert into `positive_test` values('no',7);
insert into `positive_test` values('no',8);
insert into `positive_test` values('no',9);
insert into `positive_test` values('no',10);

create table `contact`(
`date_contacted` varchar(50) not null,
`user_id` tinyint(4) not null,
`group_id` tinyint(4) not null,
`contacted_user` tinyint(4) not null,
primary key(`date_contacted`,`user_id`,`group_id`)
)engine=innodb
default charset=utf8
default collate=utf8_unicode_ci;
insert into `contact` values('09/12/20',4,2,'10');
insert into `contact` values('09/12/20',10,1,'4');
insert into `contact` values('10/03/20',5,1,'6');
insert into `contact` values('10/03/20',6,2,'5');
insert into `contact` values('11/10/20',5,1,'4');
insert into `contact` values('11/10/20',4,2,'5');
insert into `contact` values('11/02/20',3,1,'2');
insert into `contact` values('11/02/20',2,2,'3');

create table `overall_health`(
`positive` enum('yes','no'),
`test_weighted` tinyint(4),
key(`test_weighted`)
)engine=innodb
default charset=utf8
default collate=utf8_unicode_ci;
insert into `overall_health` values('no',1);
insert into `overall_health` values('no',1);
insert into `overall_health` values('no',1);
insert into `overall_health` values('yes',0);
insert into `overall_health` values('no',1);
insert into `overall_health` values('no',1);
insert into `overall_health` values('no',1);
insert into `overall_health` values('no',1);
insert into `overall_health` values('no',1);
insert into `overall_health` values('no',1);