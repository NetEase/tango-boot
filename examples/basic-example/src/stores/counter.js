import { defineStore } from '@music163/tango-boot';

defineStore(
  {
    number: 10,

    add() {
      this.number++;
    },

    decrement() {
      this.number--;
    },
  },
  'counter',
);
