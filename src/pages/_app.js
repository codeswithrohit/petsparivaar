import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import AdminNav from '../components/AdminNav';
import PetKeeperNav from '../components/PetKeeperNav';
import Footer from '../components/Footer';
import { firebase } from "../Firebase/config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/Admin");
  const isPetKeeperRoute = router.pathname.startsWith("/PetKeeper");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartLength, setCartLength] = useState(0);

  useEffect(() => {
    

    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        localStorage.setItem(
          "myuser",
          JSON.stringify({ token: authUser.uid, email: authUser.email })
        );
      } else {
        setUser(null);
        localStorage.removeItem("myuser");
        setLoading(false);
      }
    });
  

    // Cleanup function for the useEffect
    return () => {
     
      unsubscribe();
    };
  }, []);

  const [loader, setLoader] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1500);
  }, []);

  const [key, setKey] = useState();
  const [progress, setProgress] = useState(0);
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const db = firebase.firestore();

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setProgress(40);
    });
    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });

    try {
      if (localStorage.getItem("cart")) {
        const storedCart = JSON.parse(localStorage.getItem("cart"));
        setCartLength(Object.keys(storedCart).length);
        setCart(storedCart);
        saveCart(storedCart);
      }
    } catch (error) {
      localStorage.clear();
    }
    const myuser = JSON.parse(localStorage.getItem("myuser"));
    if (myuser) {
      setUser({ value: myuser.uid, email: myuser.email });
    }
    setKey(Math.random());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const saveCartToFirestore = async (cartData) => {
    if (user) {
      try {
        await db
          .collection("petparents")
          .doc(user.uid)
          .collection("cart")
          .doc("userCart")
          .set(cartData);
        // After saving to Firestore, update the local state subTotal
        updateSubTotal(cartData);
      } catch (error) {
        console.error("Error saving cart to Firestore:", error);
      }
    }
  };

  const fetchCartFromFirestore = async () => {
    if (user) {
      try {
        const cartDoc = await db
          .collection("petparents")
          .doc(user.uid)
          .collection("cart")
          .doc("userCart")
          .get();
        if (cartDoc.exists) {
          const cartData = cartDoc.data();
          setCart(cartData);
          updateSubTotal(cartData);
        }
      } catch (error) {
        console.error("Error fetching cart from Firestore:", error);
      }
    }
  };

  const updateSubTotal = (myCart) => {
    let subt = 0;
    Object.values(myCart).forEach((item) => {
      subt += item.price * item.qty;
    });
    setSubTotal(subt);
  };


  const saveCartToLocalStorage = (cartData) => {
    localStorage.setItem("cart", JSON.stringify(cartData));
    setCartLength(Object.keys(cartData).length);
  };


  const addToCart = (
    itemCode,
    qty,
    petType,
    petPrice,
    petService,
    name,
    location,
    email,
    PetDate
  ) => {
    if (!user) {
      // User is not logged in, redirect to signin page
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
            
              <div className="ml-3 flex-1">
                
                <p className="mt-1 text-sm text-red-600 font-bold font-sans">
                  Please log in to add items to cart
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));
      // Redirect to the signin page
      // Modify the '/signin' path according to your signin page route
      router.push('/signin');
      return; // Prevent further execution of addToCart function
    }
    if (Object.keys(cart).length === 0) {
      setKey(Math.random);
    }
    let newCart = cart;
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty + qty;
    } else {
      newCart[itemCode] = {   qty: 1,
        type: petType,
        price: petPrice,
        service: petService,
        name:name,
        location:location,
        petkeeperemail:email,
        PetDate:PetDate };
    }
    
    setCart(newCart);
    saveCartToFirestore(newCart);
    saveCartToLocalStorage(newCart);
    // toast.custom((t) => (
    //   <div
    //     className={`${
    //       t.visible ? 'animate-enter' : 'animate-leave'
    //     } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    //   >
    //     <div className="flex-1 w-0 p-4">
    //       <div className="flex items-start">
    //         <div className="flex-shrink-0 pt-0.5">
    //           <img
    //             className="h-10 w-10 rounded-full"
    //             src={frontImage}
    //             alt=""
    //           />
    //         </div>
    //         <div className="ml-3 flex-1">
    //           <p className="text-sm font-medium font-bold font-sans text-red-600">
    //             {productname} - ₹ {price}
    //           </p>
    //           <p className="mt-1 text-sm text-gray-500">
    //             Item added to cart
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="flex border-l border-gray-200">
    //       <button
    //         onClick={() => toast.dismiss(t.id)}
    //         className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    //       >
    //         Close
    //       </button>
    //     </div>
    //   </div>
    // ));
  };

  const bookNow = (
    itemCode,
    qty,
    petType,
    petPrice,
    petService,
    name,
    location,
    email,
    PetDate
  ) => {
    let newCart = {};
    const itemId = `${itemCode}_${Date.now()}`;
    newCart[itemId] = {  qty: 1,
      type: petType,
      price: petPrice,
      service: petService,
      name:name,
      location:location,
      petkeeperemail:email,
      PetDate:PetDate};


    setCart(newCart);
    saveCartToLocalStorage(newCart);
    saveCartToFirestore(newCart);
    router.push("/checkout");
  };

  const clearCart = () => {
    setCart({});
    saveCartToFirestore({});
    saveCartToLocalStorage({});
    toast.success("Cart cleared");
  };

  const removeFromCart = (itemCode, qty) => {
    const newCart = { ...cart };
    if (itemCode in newCart) {
      newCart[itemCode].qty -= qty;
      if (newCart[itemCode].qty <= 0) {
        delete newCart[itemCode];
      }
    }
    setCart(newCart);
    saveCartToFirestore(newCart);
    saveCartToLocalStorage(newCart);
    toast.success(`Removed ${qty} items from cart`);
  };

  useEffect(() => {
    fetchCartFromFirestore();
  }, [user]);


  return (
    <div>
    {!isAdminRoute && !isPetKeeperRoute && <Navbar />}
    {isAdminRoute && <AdminNav />}
    {/* {isPetKeeperRoute && <PetKeeperNav />} */}
    <Component bookNow={bookNow}
        cart={cart}
        cartLength={cartLength}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
        setSubTotal={setSubTotal}
        {...pageProps} />
    {!isAdminRoute && !isPetKeeperRoute && <Footer />}
  </div>
  );
}

export default MyApp;
