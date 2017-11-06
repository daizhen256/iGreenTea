import Mock from 'mockjs';

const Dicts = [];

for (let i = 0; i < 20; i++) {
    Dicts.push(Mock.mock({
    id: Mock.Random.guid(),
    value: Mock.Random.integer,
    label: Mock.Random.string,
    type: Mock.Random.string(),
    description: Mock.Random.cname(),
    order: Mock.Random.integer(0, 9)
  }));
}

export { Dicts };