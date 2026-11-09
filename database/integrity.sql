-- Defense in depth: invariants are enforced even for direct SQL imports.
ALTER TABLE "Inventory" ADD CONSTRAINT inventory_nonnegative CHECK (stock >= 0);
ALTER TABLE "Book" ADD CONSTRAINT book_price_positive CHECK (price > 0), ADD CONSTRAINT book_year_valid CHECK (year BETWEEN 1400 AND 2100);
ALTER TABLE "CartItem" ADD CONSTRAINT cart_quantity_positive CHECK (quantity BETWEEN 1 AND 100000);
ALTER TABLE "OrderItem" ADD CONSTRAINT order_item_positive CHECK (quantity > 0 AND "unitPrice" > 0);
ALTER TABLE "SpecialRequest" ADD CONSTRAINT request_quantity_positive CHECK (quantity BETWEEN 1 AND 100000);
ALTER TABLE "Quote" ADD CONSTRAINT quote_amount_positive CHECK (quantity > 0 AND "unitPrice" > 0);
CREATE INDEX "Book_title_idx" ON "Book" (title);
CREATE INDEX "Order_status_idx" ON "Order" (status);
CREATE INDEX "User_role_active_idx" ON "User" (role, active);
CREATE OR REPLACE FUNCTION prevent_order_snapshot_update() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.breakdown IS DISTINCT FROM OLD.breakdown OR NEW."userId" IS DISTINCT FROM OLD."userId" OR NEW."createdAt" IS DISTINCT FROM OLD."createdAt" OR NEW.number IS DISTINCT FROM OLD.number THEN
    RAISE EXCEPTION 'Order financial snapshot is immutable';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER order_snapshot_immutable BEFORE UPDATE ON "Order" FOR EACH ROW EXECUTE FUNCTION prevent_order_snapshot_update();
CREATE OR REPLACE FUNCTION prevent_order_item_update() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'Order items are immutable'; END;
$$;
CREATE TRIGGER order_items_immutable BEFORE UPDATE OR DELETE ON "OrderItem" FOR EACH ROW EXECUTE FUNCTION prevent_order_item_update();
