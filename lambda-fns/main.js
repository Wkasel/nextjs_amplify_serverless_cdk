"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createPost_1 = require("./createPost");
const deletePost_1 = require("./deletePost");
const getPostById_1 = require("./getPostById");
const listPosts_1 = require("./listPosts");
const updatePost_1 = require("./updatePost");
const postsByUsername_1 = require("./postsByUsername");
exports.handler = async (event) => {
    switch (event.info.fieldName) {
        case "getPostById":
            return await getPostById_1.default(event.arguments.postId);
        case "createPost": {
            const { username } = event.identity;
            return await createPost_1.default(event.arguments.post, username);
        }
        case "listPosts":
            return await listPosts_1.default();
        case "deletePost": {
            const { username } = event.identity;
            return await deletePost_1.default(event.arguments.postId, username);
        }
        case "updatePost": {
            const { username } = event.identity;
            return await updatePost_1.default(event.arguments.post, username);
        }
        case "postsByUsername": {
            const { username } = event.identity;
            return await postsByUsername_1.default(username);
        }
        default:
            return null;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBcUM7QUFDckMsNkNBQXFDO0FBQ3JDLCtDQUF1QztBQUN2QywyQ0FBbUM7QUFDbkMsNkNBQXFDO0FBQ3JDLHVEQUErQztBQWdCL0MsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLEVBQUUsS0FBa0IsRUFBRSxFQUFFO0lBQzNDLFFBQVEsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDMUIsS0FBSyxhQUFhO1lBQ2hCLE9BQU8sTUFBTSxxQkFBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDbEQsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUNqQixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQTtZQUNuQyxPQUFPLE1BQU0sb0JBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtTQUN4RDtRQUNELEtBQUssV0FBVztZQUNkLE9BQU8sTUFBTSxtQkFBUyxFQUFFLENBQUM7UUFDM0IsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUNqQixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQTtZQUNuQyxPQUFPLE1BQU0sb0JBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtTQUMxRDtRQUNELEtBQUssWUFBWSxDQUFDLENBQUM7WUFDakIsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUE7WUFDbkMsT0FBTyxNQUFNLG9CQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7U0FDeEQ7UUFDRCxLQUFLLGlCQUFpQixDQUFDLENBQUM7WUFDdEIsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUE7WUFDbkMsT0FBTyxNQUFNLHlCQUFlLENBQUMsUUFBUSxDQUFDLENBQUE7U0FDdkM7UUFDRDtZQUNFLE9BQU8sSUFBSSxDQUFBO0tBQ2hCO0FBQ0wsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZVBvc3QgZnJvbSAnLi9jcmVhdGVQb3N0J1xuaW1wb3J0IGRlbGV0ZVBvc3QgZnJvbSAnLi9kZWxldGVQb3N0J1xuaW1wb3J0IGdldFBvc3RCeUlkIGZyb20gJy4vZ2V0UG9zdEJ5SWQnXG5pbXBvcnQgbGlzdFBvc3RzIGZyb20gJy4vbGlzdFBvc3RzJ1xuaW1wb3J0IHVwZGF0ZVBvc3QgZnJvbSAnLi91cGRhdGVQb3N0J1xuaW1wb3J0IHBvc3RzQnlVc2VybmFtZSBmcm9tICcuL3Bvc3RzQnlVc2VybmFtZSdcbmltcG9ydCBQb3N0IGZyb20gJy4vUG9zdCdcblxudHlwZSBBcHBTeW5jRXZlbnQgPSB7XG4gICBpbmZvOiB7XG4gICAgIGZpZWxkTmFtZTogc3RyaW5nXG4gIH0sXG4gICBhcmd1bWVudHM6IHtcbiAgICAgcG9zdElkOiBzdHJpbmcsXG4gICAgIHBvc3Q6IFBvc3RcbiAgfSxcbiAgaWRlbnRpdHk6IHtcbiAgICB1c2VybmFtZTogc3RyaW5nXG4gIH1cbn1cblxuZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgKGV2ZW50OkFwcFN5bmNFdmVudCkgPT4ge1xuICAgIHN3aXRjaCAoZXZlbnQuaW5mby5maWVsZE5hbWUpIHtcbiAgICAgICAgY2FzZSBcImdldFBvc3RCeUlkXCI6XG4gICAgICAgICAgcmV0dXJuIGF3YWl0IGdldFBvc3RCeUlkKGV2ZW50LmFyZ3VtZW50cy5wb3N0SWQpXG4gICAgICAgIGNhc2UgXCJjcmVhdGVQb3N0XCI6IHtcbiAgICAgICAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSBldmVudC5pZGVudGl0eVxuICAgICAgICAgIHJldHVybiBhd2FpdCBjcmVhdGVQb3N0KGV2ZW50LmFyZ3VtZW50cy5wb3N0LCB1c2VybmFtZSlcbiAgICAgICAgfVxuICAgICAgICBjYXNlIFwibGlzdFBvc3RzXCI6XG4gICAgICAgICAgcmV0dXJuIGF3YWl0IGxpc3RQb3N0cygpO1xuICAgICAgICBjYXNlIFwiZGVsZXRlUG9zdFwiOiB7XG4gICAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gZXZlbnQuaWRlbnRpdHlcbiAgICAgICAgICByZXR1cm4gYXdhaXQgZGVsZXRlUG9zdChldmVudC5hcmd1bWVudHMucG9zdElkLCB1c2VybmFtZSlcbiAgICAgICAgfVxuICAgICAgICBjYXNlIFwidXBkYXRlUG9zdFwiOiB7XG4gICAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gZXZlbnQuaWRlbnRpdHlcbiAgICAgICAgICByZXR1cm4gYXdhaXQgdXBkYXRlUG9zdChldmVudC5hcmd1bWVudHMucG9zdCwgdXNlcm5hbWUpXG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBcInBvc3RzQnlVc2VybmFtZVwiOiB7XG4gICAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gZXZlbnQuaWRlbnRpdHlcbiAgICAgICAgICByZXR1cm4gYXdhaXQgcG9zdHNCeVVzZXJuYW1lKHVzZXJuYW1lKVxuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG59Il19