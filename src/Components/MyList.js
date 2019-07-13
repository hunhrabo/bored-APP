import React from "react";

const MyList = ({
  activeTab,

  savedActivities = [],
  deleteActivity,
  clearList
}) => {
  // if (typeof savedActivities === "undefined" || savedActivities.length === 0) {
  //   return null;
  // }

  const isActive = activeTab === "my-list" ? "open" : "closed";

  // console.log(savedActivities);

  return (
    <div className={`tab-container my-list-container ${isActive}`}>
      <div className="content-wrap">
        <table>
          <tbody>
            <tr>
              <th>#</th>
              <th>Activity</th>
              <th>Participants</th>
              <th>Budget</th>
              <th />
            </tr>
            {savedActivities.map((activity, index) => {
              return (
                <tr key={activity.id}>
                  <td>{index + 1}</td>
                  <td>{activity.activity}</td>
                  <td>{activity.participants}</td>
                  <td>{activity.budget}</td>
                  <td>
                    <button onClick={() => deleteActivity(activity.id)}>
                      delete this one
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button onClick={() => clearList()}>Clear list</button>
      </div>
    </div>
  );
};

export default MyList;
