# R Basic: Plotting
x <- seq(0, 2*pi, length.out=50)
y <- sin(x)
print("Plotting data points...")
print(y[1:5])
# Plot command (if supported in WASM)
# plot(x, y, type="l", col="blue")
