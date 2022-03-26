import React from "react";
import axios from "axios";
import "../App.css";
import { CartItems, StackItems } from "../App";
import Loading from "./loading";
var server = process.env.REACT_APP_SERVER
  ? process.env.REACT_APP_SERVER
  : "http://localhost:3000";
var API = process.env.API ? process.env.API : "/api";

function Items() {
  const [items, setItems] = React.useContext(StackItems);
  const [isLoaded, setLoaded] = React.useState(false);
  const [errors, setErrors] = React.useState();
  const [discounted, setDiscounted] = React.useState(false);
  const [cart, setCart] = React.useContext(CartItems);
  function removeItem(id) {
    let new_items = [];
    Object.keys(items).forEach((item, index) => {
      if (items[item].id === id) {
        let obj = items[item];
        if (obj.stack > 0) {
          obj.stack = obj.stack - 1;
        }
        new_items[item] = obj;
        let cartItem = {
          name: obj.name,
          id: obj.id,
          price: obj.price,
          img: obj.img,
        };
        setCart([...cart, cartItem]);
      } else {
        new_items[item] = items[item];
      }
    });
    setItems(new_items);
  }
  function price(price, discount) {
    if (discounted) {
      return price;
    } else {
      setDiscounted(true);
      return price - (price / 100) * discount;
    }
  }
  React.useEffect(() => {
    axios
      .get(`${server}${API}/Items`)
      .then((res) => {
        setItems(res.data);
        setLoaded(true);
      })
      .catch((error) => {
        setErrors(error);
      });
  }, [setItems]);
  let display = null;
  if (isLoaded && !errors) {
    display = Object.keys(items).map((item, index) => {
      if (items[item].discount) {
        items[item].price = price(items[item].price, items[item].discount);
      }
      return (
        <div key={index}>
        {items[item].stack ? (
        <div className="item" >
          <Item
            props={items[item]}
            height="100"
            width="18rem"
            removeItem={removeItem}
          />
        </div>
        ) : '' }
        </div>
      );
    });
  } else if (isLoaded && errors) {
    display = errors;
  }
  else if(!isLoaded){
    display = <Loading />
  }
  return <div className="items">{display}</div>;
}

function Item(props) {
  const noimage =`https://media.istockphoto.com/vectors/image-preview-icon-picture-placeholder-for-website-or-uiux-design-vector-id1222357475?k=20&m=1222357475&s=612x612&w=0&h=jPhUdbj_7nWHUp0dsKRf4DMGaHiC16kg_FSjRRGoZEI=`;
  let cardSize = (size) => {
    if (size) {
      return "main-card card border-success mb-3 h-" + size;
    } else {
      return "main-card card border-success mb-3";
    }
  };
  return (
    <div
      className={cardSize(props.height)}
      id={props.props.id}
      style={{ maxWidth: props.width }}
      onClick={() => props.removeItem(props.props.id)}
    >
      <img src={props.props.img?props.props.img:noimage} className="card-img-top" alt="..." />
      {props.props.discount ? (
        <div className="sale">FOR SALE {props.props.discount}%</div>
      ) : (
        ""
      )}
      <div className="card-body">
        <h5 className="card-title">{props.props.name} </h5>
        <p className="card-text">{props.props.info}</p>
      </div>
      <div className="card-footer">
        <small className="text-muted">
          Value :{Math.round(props.props.price * 100) / 100}$
        </small>
        <br />
        <small className="text-muted">In stack :{props.props.stack}</small>
        <br />
        <small className="text-muted">Weight :{props.props.weight}</small>
        <br />
      </div>
    </div>
  );
}

export { Item, Items };