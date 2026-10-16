type NameFields = {
  first?: string;
  last?: string;
};

type TeamData = {
  name?: NameFields;
  fullname?: string;
};

function fillFullname(data: TeamData) {
  const first = data.name?.first?.trim();
  const last = data.name?.last?.trim();
  if (first && last) {
    data.fullname = `${first} ${last}`;
  }
}

export default {
  beforeCreate(event: { params: { data: TeamData } }) {
    fillFullname(event.params.data);
  },
  beforeUpdate(event: { params: { data: TeamData } }) {
    fillFullname(event.params.data);
  },
};
