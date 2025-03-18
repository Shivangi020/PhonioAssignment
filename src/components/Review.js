import { useEffect, useState } from "react";
import { testimonialData } from "../../assets/Testimonials";
import styles from "./component.module.css";

const Review = () => {
  const [activeCard, setActiveCard] = useState(2);
  const [translateBy, setTranslateBy] = useState(0);

  useEffect(() => {
    const cardEl = document.getElementById(`Card-${activeCard}`);
    const containerEl = document.getElementById(`testimonialCardCn`);

    if (cardEl && containerEl) {
      const cardRect = cardEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();

      const parentCardCenter = containerRect.width / 2;
      console.log(parentCardCenter, cardRect.x);
      const centerTranslate =
        containerRect.width / 2 - (Math.abs(cardRect.x) + cardRect.width / 2);
      setTranslateBy(centerTranslate);
    }
  }, [activeCard]);

  return (
    <div className={styles.reviewMainCn}>
      <section className={styles.reviewTagMain}>
        <div className={styles.reviewTagLine}>We built Osmo to help</div>
        <div className={styles.reviewTagLine}>creative developers work</div>
        <div className={styles.reviewTagLine}>smarter, faster, and better.</div>
      </section>

      <hr className={styles.divider}></hr>

      <section className={styles.TestimonailMainCn}>
        <div className={styles.testimonialHeader}>Trusted By:</div>
        <div className={styles.userCn}>
          {testimonialData?.map((user) => {
            return (
              <div style={{ position: "relative" }} key={user.id}>
                <div
                  className={`${styles.testimonalUser} ${
                    activeCard === user.id ? styles.activeTestimonialuser : ""
                  }`}
                  onClick={() => setActiveCard(user.id)}
                >
                  <img
                    src={user.profileImageLink}
                    className={styles.userImg}
                  ></img>
                </div>
                {activeCard === user.id && (
                  <div className={styles.userName}>{user.name}</div>
                )}
              </div>
            );
          })}
        </div>
        <div
          className={styles.testimonialCardCn}
          style={{ transform: `translateX(${translateBy}px)` }}
          id="testimonialCardCn"
        >
          {testimonialData?.map((user) => {
            return (
              <div
                className={styles.cardMain}
                key={user.id}
                id={`Card-${user.id}`}
                onClick={() => setActiveCard(user.id)}
              >
                <div
                  className={
                    activeCard === user.id
                      ? styles.cardWrapper
                      : styles.nonActiveCard
                  }
                >
                  <div className={styles.card}>
                    <div className={styles.reviewText}>{user.review}</div>
                    <div className={styles.reviewdetail}> </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Review;
