FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MyFinance.API/MyFinance.API.csproj", "MyFinance.API/"]
RUN dotnet restore "MyFinance.API/MyFinance.API.csproj"
COPY . .
WORKDIR "/src/MyFinance.API"
RUN dotnet build "MyFinance.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MyFinance.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MyFinance.API.dll"]
