import React, { useEffect, useState } from "react";
import "./App.css";
/* Material UI */
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CloudIcon from "@mui/icons-material/Cloud";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import moment from "moment";

const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "Arial", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      main: "#2a5298",
    },
    secondary: {
      main: "#1e3c72",
    },
  },
});

let cancelAxios = null;

const cities = {
  Amman: { lat: 31.9539, lon: 35.9106 },
  Zarqa: { lat: 32.0728, lon: 36.088 },
  Irbid: { lat: 32.5563, lon: 35.85 },
};

function App() {
  const [city, setCity] = useState("");
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  useEffect(() => {
    setDate(moment().format("MMM Do YY"));
    setDay(moment().format("dddd"));

    if (city) {
      const { lat, lon } = cities[city];
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d1f0da1c0998833596b02d0d875e3783`,
          {
            cancelToken: new axios.CancelToken((c) => {
              cancelAxios = c;
            }),
          }
        )
        .then((response) => {
          const responseTemp = Math.round(response.data.main.temp - 272.15);
          const min = Math.round(response.data.main.temp_min - 272.15);
          const max = Math.round(response.data.main.temp_max - 272.15);
          const description = response.data.weather[0].description;
          const responseIcon = response.data.weather[0].icon;
          setTemp({
            number: responseTemp,
            description,
            min,
            max,
            icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      return () => {
        cancelAxios();
      };
    }
  }, [city]);

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f0f2f5",
        }}
      >
        <Card
          sx={{
            background: "linear-gradient(135deg, #1e3c72 30%, #2a5298 90%)",
            color: "#fff",
            padding: 4,
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <CardContent>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              Weather In Jordan
            </Typography>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel id="city-select-label">City</InputLabel>
              <Select
                labelId="city-select-label"
                id="city-select"
                value={city}
                label="City"
                onChange={handleChange}
              >
                <MenuItem value="Amman">Amman</MenuItem>
                <MenuItem value="Zarqa">Zarqa</MenuItem>
                <MenuItem value="Irbid">Irbid</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="h5">{city}</Typography>
            <Typography sx={{ fontSize: 30, marginBottom: 1.5 }}>
              {date}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 20 }}>
              {day}
            </Typography>
            {temp.number && (
              <>
                <div>
                  <Typography variant="h3" sx={{ margin: "20px 0" }}>
                    {temp.number}°C
                  </Typography>
                  <img src={temp.icon} alt="weather" />
                </div>
                <Typography variant="body2" sx={{ fontSize: 18 }}>
                  {temp.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "100%",
                    marginTop: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ArrowDownwardIcon />
                    <Typography variant="h6">Min: {temp.min}°C</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ArrowUpwardIcon />
                    <Typography variant="h6">Max: {temp.max}°C</Typography>
                  </Box>
                </Box>
              </>
            )}
            <CloudIcon sx={{ fontSize: 200, color: "#fff", marginTop: 20 }} />
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default App;
