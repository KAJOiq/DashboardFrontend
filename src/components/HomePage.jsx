// // import React from 'react';
// // import Sidebar from './Sidebar';
// // import { Routes, Route } from 'react-router-dom';
// // import AddUserForm from './AddUserForm';

// // const HomePage = () => {
// //   return (
// //     <div className="home-page">
// //       <Sidebar />
// //       <div className="content">
// //         <Routes>
// //           <Route path="/home/add-user" element={<AddUserForm />} />
// //           <Route path="/home" element={<h2>Welcome to the Dashboard</h2>} />
// //         </Routes>
// //       </div>
// //     </div>
// //   );
// // };

// // export default HomePage;
// import React from 'react';
// import Sidebar from './Sidebar';
// import { Routes, Route } from 'react-router-dom';
// import AddUserForm from './AddUserForm';
// import useAppStore from '../store/useAppStore';

// const HomePage = () => {
//   const { users } = useAppStore();

//   return (
//     <div className="home-page">
//       <Sidebar />
//       <div className="content">
//         <Routes>
//           <Route path="/home/add-user" element={<AddUserForm />} />
//           <Route
//             path="/home"
//             element={
//               <div>
//                 <h2>Welcome to the Dashboard</h2>
//                 <h3>Users List</h3>
//                 <table className="users-table">
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Username</th>
//                       <th>Email</th>
//                       <th>Phone</th>
//                       <th>Sex</th>
//                       <th>DOB</th>
//                       <th>Role</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {users.map((user) => (
//                       <tr key={user.id}>
//                         <td>{user.id}</td>
//                         <td>{user.username}</td>
//                         <td>{user.email}</td>
//                         <td>{user.phone}</td>
//                         <td>{user.sex}</td>
//                         <td>{user.dob}</td>
//                         <td>{user.role}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             }
//           />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default HomePage;


import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import AddUserForm from './AddUserForm';
import useAppStore from '../store/useAppStore';

const HomePage = () => {
  const { users } = useAppStore();

  return (
    <div className="home-page">
      <div className="sidebar">
        <Link to="/home">Dashboard</Link>
        <Link to="/home/add-user">Add User</Link>
      </div>
      <div className="content">
        <Routes>
          {/* Dashboard Route */}
          <Route
            path="/"
            element={
              <div>
                <h2>Welcome to the Dashboard</h2>
                <h3>Users List</h3>
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Sex</th>
                      <th>DOB</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.sex}</td>
                        <td>{user.dob}</td>
                        <td>{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          />
          {/* Add User Route */}
          <Route path="add-user" element={<AddUserForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default HomePage;
