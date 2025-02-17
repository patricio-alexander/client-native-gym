export const planDuration = ({
  initialDate = new Date(),
  price,
  currentPrice,
  duration,
}) => {
  const formattedDateInitial = `${initialDate.getFullYear()}/${
    initialDate.getMonth() + 1
  }/${initialDate.getDate()}`;

  const durationInDays = Math.ceil((price * duration) / currentPrice);

  const dateFinal = new Date(
    initialDate.getFullYear(),
    initialDate.getMonth(),
    initialDate.getDate() + durationInDays,
  );

  const formattedDateFinal = `${dateFinal.getFullYear()}/${
    dateFinal.getMonth() + 1
  }/${dateFinal.getDate()}`;

  return { formattedDateFinal, formattedDateInitial, durationInDays };
};

export const checkExpiration = (expirationDate) => {
  const [year, month, day] = expirationDate
    .split("/")
    .map((num) => parseInt(num, 10));

  const currentDate = new Date();
  const expirationDateObj = new Date(year, month - 1, day);

  // Establecer la hora a las 00:00:00 para ignorar la hora del día actual
  currentDate.setHours(0, 0, 0, 0);
  expirationDateObj.setHours(0, 0, 0, 0);

  const timeDifference = expirationDateObj.getTime() - currentDate.getTime();

  const expired = timeDifference < 0;
  let lastDay = false;

  let remainingTime = null;
  if (!expired) {
    const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    if (!remainingDays) {
      remainingTime = "Hoy finaliza la suscripción";
      lastDay = true;
    } else {
      remainingTime = `${remainingDays} día${remainingDays !== 1 ? "s" : ""} restantes`;
    }
  }

  let elapsedAfterExpiration = null;
  if (expired) {
    const elapsedDaysAfterExpiration = Math.abs(
      Math.ceil(timeDifference / (1000 * 60 * 60 * 24)),
    );
    elapsedAfterExpiration = `Finalizó hace ${elapsedDaysAfterExpiration} día${
      elapsedDaysAfterExpiration !== 1 ? "s" : ""
    }`;
  }
  // console.log({ expired, remainingTime, elapsedAfterExpiration })
  return { expired, remainingTime, elapsedAfterExpiration, lastDay };
};
