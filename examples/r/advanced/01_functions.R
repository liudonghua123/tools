# R Advanced: Functions
calculate_bmi <- function(weight, height) {
  return(weight / (height^2))
}
w <- 70
h <- 1.75
bmi_res <- calculate_bmi(w, h)
print(paste("Weight:", w, "kg"))
print(paste("Height:", h, "m"))
print(paste("BMI:", round(bmi_res, 2)))
