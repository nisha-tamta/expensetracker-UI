import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";
import "../css/NavBar.css";
import "../css/Profile.css";

const DeleteExpenseEdit = ({ onConfirm, onCancel, error }) => {
  return (
    <div className="confirmation-overlay-profile">
      <div className="confirmation-dialog-profile">
        <div className="create-chat-container">
          <div className="create-chat-header">
            <h2>Are you sure you want to delete this expense?</h2>
          </div>
          <div className="create-chat-body-profile">
            <div>
              <form onSubmit={onConfirm}>
                {error && <div className="error-message">{error}</div>}
                <div className="create-chat-button-containers">
                  <button type="submit" className="cancel-button" onClick={onConfirm}>Delete</button>
                  <span className="button-spacing"></span>
                  <button className="login-chat-button" onClick={onCancel}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enum for categories
const ExpenseCategory = {
  PERSONNELCOSTS: "Personnel Costs",
  OPERATIONALCOSTS: "Operational Costs",
  PROFESSIONALSERVICES: "Professional Services",
  MARKETINGANDCOMMUNICATION: "Marketing and Communication",
  TRAVELANDENTERTAINMENT: "Travel and Entertainment",
  SUBSCRIPTIONSANDFEES: "Subscriptions and Fees",
  TAXESANDINSURANCE: "Taxes and Insurance",
  OTHERS: "Others"
};

const ExpenseDetails = () => {
  const { expenseId } = useParams();

  const [expense, setExpense] = useState(null);
  const [error, setError] = useState(null);

  const [showDeleteExpenseEdit, setShowDeleteExpenseEdit] = useState(false);
  const [notification, setNotification] = useState({ message: "", visible: false });

  const [editMode, setEditMode] = useState(false);
  const [editedExpense, setEditedExpense] = useState(null);

  useEffect(() => {
    if (expenseId) {
      const fetchExpense = async () => {
        try {
          const response = await fetch(
            `http://192.168.29.40:8080/api/expenses/${expenseId}`
          ); // Use expenseId in the API endpoint
          if (response.ok) {
            const data = await response.json();
            setExpense(data);
            setEditedExpense(data);
          } else {
            const errorMessage = `Failed to fetch expense: ${response.status} - ${response.statusText}`;
            setError(errorMessage);
          }
        } catch (error) {
          setError(`Error during fetching expense: ${error.message}`);
        }
      };
      fetchExpense();
    }
  }, []);

  const handleDeleteExpense = () => {
    setShowDeleteExpenseEdit(true);
  };

  const handleDeleteExpenseEdit = async (e) => {
    e.preventDefault();

    const userId = JSON.parse(localStorage.getItem("user")).id;
    try {
      const response = await fetch(
        `http://192.168.29.40:8080/api/expenses/${expenseId}?userId=${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setError(null);
        setShowDeleteExpenseEdit(false);
        setNotification({ message: 'Expense delete successful!', visible: true });
      } else {
        return response.text().then(errorText => {
          setError(errorText || "Error during delete expense");
        });
      }
    } catch (error) {
      setError(error.message);
    }
    window.location.href = '/expenses';
  };

  const handleCancelDeleteExpenseEdit = () => {
    setError(null);
    setShowDeleteExpenseEdit(false);
  };

  const handleEditExpense = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEditedExpense(prevState => ({ ...prevState, [id]: value }));
  };

  const handleSaveExpense = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const response = await fetch(
        `http://192.168.29.40:8080/api/expenses/${expenseId}?userId=${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedExpense),
        }
      );

      if (response.ok) {
        setError(null);
        setExpense(editedExpense);
        setEditMode(false);
        setNotification({ message: 'Expense edit successful!', visible: true });
      } else {
        return response.text().then(errorText => {
          setError(errorText || "Error during edit expense");
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancelEditExpense = () => {
    setEditedExpense(expense);
    setEditMode(false);
  };

  return (
    <div className="container">
      <NavBar />
      <div className="homescreen-container">
        <div className="content-container">
          {notification.visible &&
            <div className="notification-message alert-success">
              {notification.message}
              <span className="close-button" onClick={() => setNotification({ ...notification, visible: false })}>
                <FontAwesomeIcon icon={faTimes} style={{ color: 'green' }} />
              </span>
            </div>
          }
          <div className="content-header">
            <h1>Expense Details</h1>
          </div>
          <div>
            <div className="content-chat-container-expense">
              <div className="content-body">
                {expense ? (
                  <div>
                    <div >
                      <div>
                        <div className="info-header-expense-details">
                          {editMode ? (
                            <input
                              className="info-header-expense-details"
                              type="text"
                              id="description"
                              value={editedExpense.description}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <div className="description-wrapper">
                              <h2>{expense.description}</h2>
                              {!editMode && (
                                <button className="button-edit-expense" onClick={handleEditExpense}>
                                  <FontAwesomeIcon icon={faPencilAlt} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="profile-details">
                          <div className="profile-info">
                            <div className="tab-list account-info-list">
                              <div>
                                <span className="account-info-item">Date:</span>
                                {editMode ? (
                                  <input
                                    className="create-chat-input"
                                    type="date"
                                    id="date"
                                    value={editedExpense.date}
                                    onChange={handleInputChange}
                                  />
                                ) : (
                                  <span className="account-info">
                                    {new Date(expense.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                  </span>
                                )}
                              </div>
                              <div>
                                <span className="account-info-item">Category:</span>
                                {editMode ? (
                                  <select
                                    className="create-chat-input"
                                    value={editedExpense.category}
                                    id="category" 
                                    onChange={handleInputChange}
                                  >
                                    <option className="item-value-expense" value="">Select Category</option>
                                    <option className="item-value-expense" value={ExpenseCategory.PERSONNELCOSTS} title="Expenses related to salaries, benefits, etc.">Personnel Costs</option>
                                    <option className="item-value-expense" value={ExpenseCategory.OPERATIONALCOSTS} title="Day-to-day business expenses like rent, utilities etc.">Operational Costs</option>
                                    <option className="item-value-expense" value={ExpenseCategory.PROFESSIONALSERVICES} title="Fees paid for services like legal, accounting, etc.">Professional Services</option>
                                    <option className="item-value-expense" value={ExpenseCategory.MARKETINGANDCOMMUNICATION} title="Expenses related to marketing, advertising, public relations, etc.">Marketing and Communication</option>
                                    <option className="item-value-expense" value={ExpenseCategory.TRAVELANDENTERTAINMENT} title="Expenses related to business trips, client meetings, entertainment, etc.">Travel and Entertainment</option>
                                    <option className="item-value-expense" value={ExpenseCategory.SUBSCRIPTIONSANDFEES} title="Expenses related to business subscriptions like software, memberships, etc.">Subscriptions and Fees</option>
                                    <option className="item-value-expense" value={ExpenseCategory.TAXESANDINSURANCE} title="Business taxes, licenses and insurance expenses.">Taxes and Insurance</option>
                                    <option className="item-value-expense" value={ExpenseCategory.OTHERS} title="Any other business-related expenses that don't fit into the other categories.">Others</option>
                                  </select>
                                ) : (
                                  <span className="account-info">{expense.category}</span>
                                )}
                              </div>
                              {expense.category === 'Personnel Costs' && (
                                <div>
                                  <span className="account-info-item">Employee:</span>
                                  {editMode ? (
                                    <input
                                      className="create-chat-input"
                                      type="text"
                                      id="employee"
                                      value={editedExpense.employee.name}
                                      onChange={handleInputChange}
                                    />
                                  ) : (
                                    <span className="account-info">{expense.employee.name}</span>
                                  )}
                                </div>
                              )}
                              <div>
                                <span className="account-info-item">Amount:</span>
                                {editMode ? (
                                  <input
                                    className="create-chat-input"
                                    type="number"
                                    id="amount"
                                    value={editedExpense.amount}
                                    onChange={handleInputChange}
                                  />
                                ) : (
                                  <span className="account-info">{expense.amount}</span>
                                )}
                              </div>
                              <div>
                                <span className={editMode ? "account-info-item-blurred" : "account-info-item-blurred"}>Notes...</span>
                                {editMode ? (
                                  <textarea
                                    className="note-display account-info-blurred"
                                    id="notes"
                                    rows="2"
                                    value={editedExpense.notes}
                                    onChange={handleInputChange}
                                  />
                                ) : (
                                  <div className={editMode ? "account-info" : "note-display account-info-blurred"}>
                                    {expense.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {editMode && (
                      <div>
                        <button className="button-expense-edit-save" onClick={handleSaveExpense}>
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <span className="button-spacing"></span>
                        <button className="button-expense-edit-cancel" onClick={handleCancelEditExpense}>
                          Cancel
                        </button>
                      </div>
                    )}
                    <div>
                      <button onClick={handleDeleteExpense} className="add-expense-button">Delete Expense</button>
                      {showDeleteExpenseEdit &&
                        <DeleteExpenseEdit
                          onConfirm={handleDeleteExpenseEdit}
                          onCancel={handleCancelDeleteExpenseEdit}
                          error={error}
                        />
                      }
                    </div>
                  </div>
                ) : (
                  <h2>Loading...</h2>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetails;
