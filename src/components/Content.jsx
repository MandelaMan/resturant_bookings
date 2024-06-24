import { useRef, useState, useEffect } from 'react'
import mock_data from "../utils/data.json";
import moment from 'moment';
import 'moment/locale/en-gb';
import { Search } from "react-feather";
import { BiSolidUpArrow, BiSolidDownArrow,   } from "react-icons/bi";
import { TfiFilter, TfiClose } from "react-icons/tfi";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'
import sad from "../assets/no-bookings.png"

const Content = () => {
  const node = useRef();

  // Intialization of header elements to be used when sorting and data display
  const th_columns = [
    {
      id: 0,
      key: "id",
      label: "#",
    },
    {
      id: 1,
      key: "start",
      label: "Arrival Time",
    },
    {
      id: 2,
      key: "customer",
      label: "Customer Details",
    },
     {
      id: 3,
      key: "businessDate",
      label: "Booked On",
    },
     {
      id: 4,
      key: "shift",
      label: "Shift",
    },
     {
      id: 5,
      key: "quantity",
      label: "No of People",
    },
     {
      id: 6,
      key: "area",
      label: "Sitting Area",
    },
     {
      id: 7,
      key: "guestNotes",
      label: "Guest Notes",
    }, {
      id: 8,
      key: "status",
      label: "Booking Status",
    }
  ]

  const { reservations } = mock_data

  // Intialization of state to handle different states in the application
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false)
  const [sort, setSort] = useState({ key: "id" , order : "asc"})
  const [isFiltering, setIsFiltering] = useState(false)
  const [date, setDate] = useState(new Date())
  const [filters, setFilters] = useState({
    // date: null || moment(date).format('DD.MM.YYYY'),
    date: null,
    status: null,
    shift: null,
    area: null,
  })
  
  // Function uses moment to convert dates to ahuman readable format
  const getHumanDate = (date_input) => {
    const date = moment(date_input);

    const formattedDate = date.format('Do MMMM, h:mma');
    // Date will appear as '2nd August, 3:00pm'

    return formattedDate;
  }; 

  
  // Function to handle filtering every time 'Apply Filters' button is clicked
  const applyfilters = () => {
    setLoading(true);

    let sorted = reservations;
    
    // Carries out filtering by checking that the default state value set is not null
    sorted = reservations.filter((reservation) => {
       return (!filters.shift || reservation.shift === filters.shift) &&
        (!filters.date || reservation.businessDate === filters.date) &&
        (!filters.area || reservation.area === filters.area) &&
        (!filters.status || reservation.status === filters.status);
    })
    
    // Set result to Bookings state after sorting is complete
    setBookings(sorted)   
    
    // Removes the modal and hides the filtering screen
    setIsFiltering(false)

    setTimeout(() => { 
      setLoading(false);
    }, 1000);
  }

  // Generic function to help reset the states of filters, date  
  const clearFilters = (showReservations = false) => {
    setDate(new Date())

    setFilters({
      date: null,
      status: null,
      shift: null,
      area: null,
    });
    
    // if 'showReservations' is set to true call will be made to fetch reservations
    if(showReservations){
      getReservations(); 
    }    
  }

  // Sorts the different columns by setting state
  const handleSorting = (column) => {

    // Current column is passed and key and order values are extracted
    setSort({
      key: column.key,
      order: column.key === sort.key ? sort.order === 'desc' ? 'asc' : 'desc' : 'asc'
    })
  }
  
  // Function to sort array based on order i.e. Ascending or Descending
  const sortedData = (dataArray) => {
    if(sort.order === "asc"){

      // return array sorted in Ascending order
      return dataArray.sort((a,b) => (a[sort.key] > b[sort.key] ? 1 : -1))
    }
     
    // return array sorted in Descending order
    return dataArray.sort((a,b) => (a[sort.key] > b[sort.key] ? -1 : 1))
  }

  // Function is invoked when search term changes
  const searchTermChanged = (e) => {
    const { value } = e.target;   
    
    // Enusre value is in lowerCae
    const searchQuery = value.toLowerCase()
    
    setFilters({
      date: null,
      status: null,
      shift: null,
      area: null,
    })

    const keys = ["firstName","lastName"]

    let searchResults = reservations;
    
    // Use the set keys to iterate through array and only search the 'firstName' and 'lastName' fields
    searchResults = 
    reservations.filter((reservation) => keys.some((key) => reservation.customer[key].toLowerCase().includes(searchQuery)))
      
    setBookings(searchResults);
  };

  // Handles Calendar inputs
  const onChange = (date_input) => {
    setDate(date_input)

    setFilters({
      ...filters,
      date: moment(date_input).format('DD.MM.YYYY')
    })
  }

  
  // Handles fetching of bookings would be replaced with an API call
  const getReservations = async () => {
    try{
      setBookings(reservations)
    }
    catch(err){
      console.log(err)
    }
  } 

  // Function to help with the opening and closing of the modal
  const handleClick = (e) => {
    if (!node.current.contains(e.target)) {
      setIsFiltering(false);
      return;
    }
  };

  // Update state of key filter attributes 'shift, area, status'
  const handleChange = (e) => {
    const { name, checked, value } = e.target;

    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: checked ? value : null, 
    }));
  };
    
  useEffect(() => {               
    getReservations()

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);

      setFilters({
        date: null,
        status: null,
        shift: null,
        area: null,
      })
    };
    // eslint-disable-next-line
  } ,[]) 

  return (
    <div className="content">
      <div className="view">
        <div className='header'>
          <h2>Table Reservations</h2> 
          <div className='search'>          
            <input type="text" 
              placeholder='Search by customer name' name="query" value={filters.search}
              onChange={(e) => {
                e.preventDefault();
                searchTermChanged(e);
              }} />               
            &nbsp;
            <button type='submit'>
              <Search size={22}/>
            </button>
          </div> 
          <div className='add_resv'> 
            <button>Add New Reservation</button>
          </div>       
        </div>      
        <div className='reservation_list'>       
            <div className='heading'>
              <h3>Reservation List</h3>
              <button onClick={() => setIsFiltering(true)}><TfiFilter size={12}/>&nbsp;Filters</button>        
            </div>  
            {loading ? <div className='loading'>
                <p>Loading ...</p>
              </div>
             : <>
                {bookings.length > 0 ? <table className="table table-striped">
                <thead>
                    <tr>
                      {th_columns.map((t,i) => 
                        <th key={i} onClick={() => handleSorting(t)}>
                          {t.label} 
                          <span>
                            &nbsp;
                            {t.key === sort.key && 
                            <>
                              {sort.order === "asc" ? <BiSolidUpArrow size={10}/> : <BiSolidDownArrow size={10}/>}
                            </>}
                          </span>
                        </th>
                      )}
                    </tr>
                </thead>
                <tbody>
                  {sortedData(bookings).map((r,i) => 
                    <tr key={i}>
                      <td>{r.id}</td>
                      <td>{getHumanDate(r.start)}</td>
                      <td>{`${r.customer.firstName} ${r.customer.lastName}`}</td>
                      <td>{r.businessDate}</td>
                      <td>{r.shift}</td>
                      <td>{r.quantity}</td>
                      <td>{r.area}</td>
                      <td width={400}>{r.guestNotes}</td>
                      <td>{r.status}</td>
                    </tr>)}          
                </tbody>
              </table> : 
              <div className='loading'>
                <p>
                  <img src={sad} /><br/>
                  No bookings are available
                  <br/><br/>
                  <button className='default' onClick={() => {
                      clearFilters(true)
                    }}>
                    Clear All Filters
                  </button> 
                </p>        
              </div>}
             </>}       
        </div>      
      </div>
      <div className={`filter_options ${isFiltering ? 'show' : 'hide'}`}>     
        <div className="filter_box" ref={node}>
          <h3>
            <span>
              <TfiFilter size={12}/>&nbsp;Filter Options
            </span>
            <button onClick={() => {
              getReservations();
              setIsFiltering(false);
            }}><TfiClose size={15} /></button>
          </h3>
          <div className='labels'>
            <Calendar onChange={onChange} value={date}/>
          </div>          
          <div className='labels'>
            <h4>Status</h4>
            <ul className='sub_labels'>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="status"
                    value="SEATED"
                    checked={filters.status === "SEATED"}
                    onChange={handleChange}
                  />
                  &nbsp;&nbsp;Seated
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="status"
                    value="NOT CONFIRMED"
                    checked={filters.status === "NOT CONFIRMED"}
                    onChange={handleChange}
                  />
                  &nbsp;&nbsp;Confirmed
                </label>
              </li>
              <li>
                <label>
                   <input
                    type="checkbox"
                    name="status"
                    value="CONFIRMED"
                    checked={filters.status === "CONFIRMED"}
                    onChange={handleChange}
                  />
                  &nbsp;&nbsp;Not Confirmed
                </label>
              </li>
              <li>
                <label>
                   <input
                    type="checkbox"
                    name="status"
                    value="CHECKED OUT"
                    checked={filters.status === "CHECKED OUT"}
                    onChange={handleChange}
                  />
                  &nbsp;&nbsp;Checked Out
                </label>
              </li>
            </ul>
          </div>
          <div className='labels'>
            <h4>Shift</h4>
            <ul className='sub_labels'>
              <li>
                <label>
                   <input
                    type="checkbox"
                    name="shift"
                    value="BREAKFAST"
                    checked={filters.shift === "BREAKFAST"}
                    onChange={handleChange}
                  />
                  &nbsp;&nbsp;Breakfast
                </label>
              </li>
              <li>
                 <label>
                  <input
                    type="checkbox"
                    name="shift"
                    value="DINNER"
                    checked={filters.shift === "DINNER"}
                    onChange={handleChange}
                  />
                  &nbsp;&nbsp;Dinner
                </label>
              </li>              
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="shift"
                    value="LUNCH"
                    checked={filters.shift === "LUNCH"}
                    onChange={handleChange}
                  />
                  &nbsp;&nbsp;Lunch
                </label>
              </li>
            </ul>
          </div>
          <div className='labels'>
            <h4>Area</h4>
            <ul className='sub_labels'>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="area"
                    value="DINNING"
                    checked={filters.area === "DINNING"}
                    onChange={handleChange}
                  />
                  &nbsp;&nbsp;Dinning
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="area"
                    value="MAIN ROOM"
                    checked={filters.area === "MAIN ROOM"}
                    onChange={handleChange}
                  />
                  &nbsp;&nbsp;Main Room
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="area"
                    value="BAR"
                    checked={filters.area === "BAR"}
                    onChange={handleChange}
                  />
                  &nbsp;&nbsp;Bar
                </label>
              </li>
            </ul>
          </div>
          <div className='filter_btns'>
            <button className='default' onClick={() => clearFilters(true)}>Reset all</button>
            {Object.values(filters).every(value => value === null) ? 
              <button className='bookings' onClick={() => applyfilters()}>Back to Bookings</button>  
              : 
              <button className='filter' onClick={() => applyfilters()}>Apply Filters</button>   
            }                     
          </div>
        </div>   
      </div>   
    </div>
  )
}

export default Content