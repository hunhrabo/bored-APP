import React from "react";

const MyList = ({
  activeTab,
  savedActivities = [],
  deleteActivity,
  clearList
}) => {
  const isActive = activeTab === "my-list" ? "open" : "closed";

  if (savedActivities.length === 0) {
    return (
      <div className={`tab-container my-list-container ${isActive}`}>
        <div className="content-wrap">
          <table className="my-list-table">
            <tbody>
              <tr>
                <th>#</th>
                <th>Activity</th>
                <th>Participants</th>
                <th>Budget</th>
                <th />
              </tr>
            </tbody>
          </table>
          <h2 className="no-saved-activities-msg">Nothing here...</h2>
          <button
            className="clear-list-btn"
            disabled={true}
            onClick={() => clearList()}
          >
            Clear all
          </button>
        </div>
      </div>
    );
  }

  // if there are saved activities
  return (
    <div className={`tab-container my-list-container ${isActive}`}>
      <div className="content-wrap">
        <table className="my-list-table">
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
                    <button
                      className="delete-activity-btn"
                      onClick={() => deleteActivity(activity.id)}
                    >
                      <i className="far fa-check-circle fa-2x" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button
          className="clear-list-btn"
          disabled={false}
          onClick={() => clearList()}
        >
          Clear all
        </button>
      </div>
    </div>
  );
};

export default MyList;
