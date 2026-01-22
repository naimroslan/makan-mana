import { css, useTheme } from "@emotion/react";
import { VISIBLE_ITEM_HEIGHT } from "@Utils/constants";
import getStyle from "@Components/RestaurantRoller/RestaurantRoller.css";
import type { RestaurantRollerProps } from "@Types/components/RestaurantRoller.type";

const RestaurantRoller = ({
  restaurants,
  selectedRestaurant,
  containerRef,
  onClick,
}: RestaurantRollerProps) => {
  const theme = useTheme();
  const styles = getStyle(theme, VISIBLE_ITEM_HEIGHT);

  return (
    <div css={styles.wrapper}>
      <div css={styles.frame}>
        <div css={styles.gradientTop} />
        <div css={styles.gradientBottom} />
        <div ref={containerRef} css={styles.list}>
          {restaurants.map((name, i) => {
            const isSelected = name === selectedRestaurant;
            return (
              <div
                key={name + i}
                onClick={() => onClick(name)}
                css={[
                  styles.item,
                  css`
                    color: ${isSelected
                      ? theme.colors.text
                      : theme.colors.gray[500]};
                    opacity: ${isSelected ? 1 : 0.3};
                  `,
                ]}
              >
                {name}
              </div>
            );
          })}

          {restaurants.length === 0 && (
            <div css={styles.loading}>Loading restaurants...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantRoller;
