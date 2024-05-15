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

  const th_columns = [
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

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(false)

  const [sort, setSort] = useState({ key: "start" , order : "asc"})

  const [isFiltering, setIsFiltering] = useState(false)
  
  const getHumanDate = (date_input) => {
    const date = moment(date_input);

    const formattedDate = date.format('Do MMMM, h:mma');

    return formattedDate;
  }; 

  const [date, setDate] = useState(new Date())

  const [filters, setFilters] = useState({
    date: null || moment(date).format('DD.MM.YYYY'),
    status: null,
    shift: null,
    area: null,
  })

  const applyfilters = () => {

    setLoading(true);

    let sorted = reservations;

    sorted = reservations.filter((reservation) => {
       return (!filters.shift || reservation.shift === filters.shift) &&
        (!filters.date || reservation.businessDate === filters.date) &&
        (!filters.area || reservation.area === filters.area) &&
        (!filters.status || reservation.status === filters.status);
    })
    
    setBookings(sorted)         
    setIsFiltering(false)

    setTimeout(() => { 
      setLoading(false);
    }, 1000);
  }

  const handleSorting = (column) => {
    setSort({
      key: column.key,
      order: column.key === sort.key ? sort.order === 'desc' ? 'asc' : 'desc' : 'asc'
    })
  }
  
  const sortedData = (dataArray) => {
    if(sort.order === "asc"){
      return dataArray.sort((a,b) => (a[sort.key] > b[sort.key] ? 1 : -1))
    }

    return dataArray.sort((a,b) => (a[sort.key] > b[sort.key] ? -1 : 1))
  }

  const searchTermChanged = (e) => {
    const { value } = e.target;    

    const keys = ["firstName","lastName"]

    let searchResults = reservations;

    searchResults = 
    reservations.filter((reservation) => keys.some((key) => reservation.customer[key].toLowerCase().includes(value)))
      
    setBookings(searchResults);
  };

  const onChange = (date_input) => {
    setDate(date_input)

    setFilters({
      ...filters,
      date: moment(date_input).format('DD.MM.YYYY')
    })
  }

  const getReservations = async () => {
    try{
      setBookings(reservations)
    }
    catch(err){
      console.log(err)
    }
  } 

  const handleClick = (e) => {
    if (!node.current.contains(e.target)) {
      setIsFiltering(false)
      return;
    }
  };
    
  useEffect(() => {               
    getReservations()

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
    // eslint-disable-next-line
  } ,[]) 

  return (
    <div className="content">
      <div className="view">
        <div className='header'>
          <h2>Table Reservations</h2> 
          <form className='search'>          
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
          </form> 
          <div className='add_resv'> 
            <button>Add New Reservation</button>
          </div>       
        </div>      
        <div className='reservation_list'>       
            <div className='heading'>
              <h3>Reservation List</h3>
              <button onClick={() => setIsFiltering(true)}><TfiFilter size={12}/>&nbsp;Filter</button>
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
                      {/* <td>{r.id}</td> */}
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
                <p><img src={sad} /><br/>No bookings are available</p>              
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
            <button onClick={() => setIsFiltering(false)}><TfiClose size={15} /></button>
          </h3>
          <div className='labels'>
            <Calendar onChange={onChange} value={date}/>
          </div>          
          <div className='labels'>
            <h4>Status</h4>
            <ul className='sub_labels'>
              <li>
                <label>
                  <input type="checkbox" name="status" checked={filters.status === "SEATED" ? true : false} onChange={() => setFilters({...filters,
                    status: "SEATED"
                  })}/>
                  &nbsp;&nbsp;Seated
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" name="status" checked={filters.status === "NOT CONFIRMED" ? true : false} onChange={() => setFilters({...filters,
                    status: "NOT CONFIRMED"
                  })}/>
                  &nbsp;&nbsp;Not Confirmed
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" name="status" checked={filters.status === "CONFIRMED" ? true : false} onChange={() => setFilters({...filters,
                    status: "CONFIRMED"
                  })}/>
                  &nbsp;&nbsp;Not Confirmed
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" name="status" checked={filters.status === "CHECKED OUT" ? true : false} onChange={() => setFilters({...filters,
                    status: "CHECKED OUT"
                  })}/>
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
                  <input type="checkbox" name="shift" checked={filters.shift === "BREAKFAST" ? true : false} onChange={() => setFilters({...filters,
                    shift: "BREAKFAST"
                  })}/>
                  &nbsp;&nbsp;Breakfast
                </label>
              </li>
              <li>
                 <label>
                  <input type="checkbox" name="shift" checked={filters.shift === "DINNER" ? true : false} onChange={() => setFilters({...filters,
                    shift: "DINNER"
                  })}/>
                  &nbsp;&nbsp;Dinner
                </label>
              </li>              
              <li>
                <label>
                  <input type="checkbox" name="shift" checked={filters.shift === "LUNCH" ? true : false} onChange={() => setFilters({...filters,
                    shift: "LUNCH"
                  })}/>
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
                  <input type="checkbox" name="area" checked={filters.area === "DINNING" ? true : false} onChange={() => setFilters({...filters,
                    area: "DINNING"
                  })}/>
                  &nbsp;&nbsp;Dinning
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" name="area" checked={filters.area === "MAIN ROOM" ? true : false} onChange={() => setFilters({...filters,
                    area: "MAIN ROOM"
                  })}/>
                  &nbsp;&nbsp;Main Room
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" name="area" checked={filters.area === "BAR" ? true : false} onChange={() => setFilters({...filters,
                    area: "BAR"
                  })}/>
                  &nbsp;&nbsp;Bar
                </label>
              </li>
            </ul>
          </div>
          <div className='filter_btns'>
            <button onClick={() => {
              setDate(new Date());

              setFilters({
                date: null,
                status: null,
                shift: null,
                area: null,
              });
            }}>Reset all</button>
            <button onClick={() => applyfilters()}>Apply Filters</button>
          </div>
        </div>   
      </div>   
    </div>
  )
}

export default Content