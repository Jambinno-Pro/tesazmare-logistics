
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY ["backend/Tesazmare.Api/Tesazmare.Api.csproj", "backend/Tesazmare.Api/"]

RUN dotnet restore "backend/Tesazmare.Api/Tesazmare.Api.csproj"

COPY . .

WORKDIR /src/backend/Tesazmare.Api

RUN dotnet publish "Tesazmare.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

ENV ASPNETCORE_HTTP_PORTS=10000

EXPOSE 10000

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Tesazmare.Api.dll"]
