import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Tasks } from './tasks';

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const userId = Random.id();
      let taskId;

      beforeEach(() => {
        Tasks.remove({});
        taskId = Tasks.insert({
          text: 'test task',
          createdAt: new Date(),
          owner: userId,
          username: 'stew'
        });
      });

      it('can delete owned task', () => {
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
        const invocation = { userId };

        deleteTask.apply(invocation, [taskId]);
        assert.equal(Tasks.find().count(), 0);
      });

      it('can make task private', () => {
        const setPrivate = Meteor.server.method_handlers['tasks.setPrivate'];
        const invocation = { userId };
        const setToPrivate = true;

        setPrivate.apply(invocation, [taskId, setToPrivate]);
        assert.equal(Tasks.find({ private: true }).count(), 1);
        assert.equal(Tasks.find({ private: false }).count(), 0);
      });

      it('can mark a task as complete', () => {
        const setToChecked = Meteor.server.method_handlers['tasks.setChecked'];
        const invocation = { userId };
        const setChecked = true;

        setToChecked.apply(invocation, [taskId, setChecked]);
        assert.equal(Tasks.find({ checked: true }).count(), 1);
        assert.equal(Tasks.find({ checked: false }).count(), 0);
      });
    });
  });
}
