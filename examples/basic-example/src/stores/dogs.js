import { defineStore } from '@music163/tango-boot';

defineStore(
  {
    list: {},

    image: '',

    async listAllBreeds() {
      const ret = await tango.services.list();
      this.list = ret.message;
    },

    async getRandomImage(name) {
      const ret = await tango.services.getBreed(null, {
        pathVariables: {
          breed: name,
        },
      });
      this.image = ret.message;
    },
  },
  'dogs',
);
