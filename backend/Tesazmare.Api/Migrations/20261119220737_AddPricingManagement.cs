using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace Tesazmare.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPricingManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PricingRules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    ServiceType = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    RouteName = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: true),
                    PickupLocation = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    DropoffLocation = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    MinimumPassengers = table.Column<int>(type: "int", nullable: false),
                    MaximumPassengers = table.Column<int>(type: "int", nullable: false),
                    PricingBasis = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false),
                    Currency = table.Column<string>(type: "varchar(3)", maxLength: 3, nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    EffectiveFromUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    EffectiveUntilUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Description = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricingRules", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_PricingRules_ServiceType_PickupLocation_DropoffLocation_Mini~",
                table: "PricingRules",
                columns: new[] { "ServiceType", "PickupLocation", "DropoffLocation", "MinimumPassengers", "MaximumPassengers" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PricingRules");
        }
    }
}
